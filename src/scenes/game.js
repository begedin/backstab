import Phaser from 'phaser';

import * as Random from 'backstab/Random';
import CreatureFactory from 'backstab/CreatureFactory';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import { getGrid } from 'backstab/objects/dungeon';
import Player from 'backstab/Player';
import globals from 'backstab/globals';
import CameraController, { setupCamera } from 'backstab/CameraController';
import PlayerController from 'backstab/PlayerController';
import { gridToWorld } from 'backstab/objects/grid/convert';
import { decide, execute } from 'backstab/AI';
import { createTurnQueue, updateTurnQueue } from 'backstab/TurnSystem';
import {
  bumpTween,
  damageEffectTween,
  moveTween,
} from 'backstab/objects/actionTweens';
import performPlayerCommand from 'backstab/actions/performPlayerCommand';
import { renderInitial, renderUpdated } from 'backstab/renderers/entities';
import { js as EasystarJs } from 'easystarjs';

const spawnDungeon = mapSize => new DungeonGenerator(mapSize, mapSize);

const spawn = mapSize => {
  // spawning everything
  const dungeon = spawnDungeon(mapSize);
  const { startingLocation } = dungeon;
  const player = new Player(
    startingLocation.x,
    startingLocation.y,
    Phaser.Utils.String.UUID(),
  );
  const enemies = dungeon.features.map(feature => {
    const { x, y } = Random.pick(feature.innerPoints);

    let enemy;

    switch (Random.pick([3, 3, 3])) {
      case 1:
        enemy = CreatureFactory.createDummy(feature, x, y);
        break;
      case 2:
        enemy = CreatureFactory.createAttacker(feature, x, y);
        break;
      case 3:
        enemy = CreatureFactory.createPalantir(feature, x, y);
        break;
      default:
        break;
    }

    feature.enemies.push(enemy);
    return enemy;
  });

  return { dungeon, enemies, player };
};

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.scene.launch('GameUI');

    const mapSize = 80;
    const { dungeon, player, enemies } = spawn(mapSize);

    const easystar = new EasystarJs();
    const grid = getGrid(dungeon);
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0, 1]);
    easystar.enableSync();
    this.pathfinder = easystar;

    this.gameData = { player, dungeon, enemies };

    // setting up camera
    const { main: camera } = this.cameras;

    const { TILE_SIZE } = globals;
    setupCamera(camera, TILE_SIZE, mapSize, dungeon.startingLocation);
    this.renderData = renderInitial(this, TILE_SIZE, mapSize);

    this.cameraController = new CameraController(camera, this.input);

    const playerController = new PlayerController(this.input);
    playerController.on('command', command => this.handleInput(command));
    this.playerController = playerController;

    this.turnQueue = createTurnQueue(enemies.concat(player));
  }

  get currentTurnSlot() {
    return this.turnQueue[0];
  }

  playbackAction(action) {
    const timeline = this.tweens.createTimeline();
    const { type, outcome } = action;

    if (type === 'MELEE_ATTACK') {
      const { subject, target: object, value } = outcome;
      const { playerContainer, enemyContainers } = this.renderData;
      const allContainers = enemyContainers.concat(playerContainer);
      const subjectContainer = allContainers.find(
        c => c.getData('id') === subject.id,
      );

      const objectContainer = allContainers.find(
        c => c.getData('id') === object.id,
      );

      const { x, y } = objectContainer;

      const text = this.add.text(x, y - globals.TILE_SIZE, value);
      text.setOrigin(0.5);

      const tween = this.add.tween(
        damageEffectTween(text, {
          x,
          y: y - 2 * globals.TILE_SIZE,
        }),
      );

      if (object instanceof Player) {
        this.events.emit('healthChange', object);
      }

      tween.setCallback(
        'onComplete',
        () => {
          text.destroy();
        },
        this,
      );

      timeline.add(bumpTween(subjectContainer, objectContainer));
    }

    if (type === 'MOVE') {
      const { subject, target: gridLocation } = outcome;
      const { playerContainer, enemyContainers } = this.renderData;
      const allContainers = enemyContainers.concat(playerContainer);
      const subjectContainer = allContainers.find(
        c => c.getData('id') === subject.id,
      );

      const { x, y } = {
        x: gridToWorld(gridLocation.x),
        y: gridToWorld(gridLocation.y),
      };

      timeline.add(moveTween(subjectContainer, { x, y }));
    }

    if (type === 'BUMP') {
      const { target: gridLocation } = outcome;
      const { playerContainer } = this.renderData;
      const { x, y } = {
        x: gridToWorld(gridLocation.x),
        y: gridToWorld(gridLocation.y),
      };
      timeline.add(bumpTween(playerContainer, { x, y }));
    }

    if (type === 'WAIT') {
      const { subject } = outcome;
      const { playerContainer, enemyContainers } = this.renderData;
      const allContainers = enemyContainers.concat(playerContainer);
      const subjectContainer = allContainers.find(
        c => c.getData('id') === subject.id,
      );
      const { x, y } = subjectContainer;

      timeline.add(bumpTween(subjectContainer, { x, y }));
    }

    timeline.setCallback(
      'onStart',
      () => {
        this.isActionInProgress = true;
      },
      this,
    );

    timeline.setCallback('onComplete', () => {
      this.isActionInProgress = false;
      this.turnQueue = updateTurnQueue(this.turnQueue);
      this.events.emit('turnChange', this.turnQueue);
    });

    timeline.play();
  }

  update(delta) {
    const isPlayersTurn = this.currentTurnSlot.actor === this.gameData.player;

    if (isPlayersTurn) {
      this.playerController.update();
    }

    if (!isPlayersTurn && !this.isActionInProgress) {
      const { gameData, currentTurnSlot, pathfinder } = this;

      if (currentTurnSlot.actor.status !== 'DEAD') {
        const action = decide(currentTurnSlot.actor, gameData, pathfinder);
        const outcome = execute(action);
        this.playbackAction(outcome);
      }

      this.turnQueue = updateTurnQueue(this.turnQueue);
      this.events.emit('turnChange', this.turnQueue);
    }

    this.cameraController.update(delta);

    renderUpdated(this, globals.TILE_SIZE);
  }

  handleInput(command) {
    if (this.isActionInProgress) {
      return;
    }

    const action = performPlayerCommand(command, this.gameData);

    if (!action) {
      return;
    }

    this.playbackAction(action);

    const { playerContainer } = this.renderData;

    this.cameras.main.startFollow(playerContainer);
  }
}
