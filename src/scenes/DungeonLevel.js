import Phaser from 'phaser';
import { getGrid } from 'backstab/objects/DungeonLevel';
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
import Player from 'backstab/Player';

export default class DungeonLevel extends Phaser.Scene {
  constructor() {
    super('DungeonLevel');
  }

  create(dungeon) {
    this.scene.launch('GameUI');

    const { player, currentLevel, mapSize } = dungeon;
    const { enemies } = currentLevel;

    const grid = getGrid(currentLevel);
    const easystar = new EasystarJs();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0, 1]);
    easystar.enableSync();
    this.pathfinder = easystar;

    this.gameData = { player, dungeon, enemies };

    // setting up camera
    const { main: camera } = this.cameras;
    camera.fadeIn(1000);

    const { TILE_SIZE } = globals;
    setupCamera(camera, TILE_SIZE, mapSize, player);
    this.renderData = renderInitial(this, TILE_SIZE, mapSize);
    camera.startFollow(this.renderData.playerContainer);

    this.cameraController = new CameraController(camera, this.input);

    const playerController = new PlayerController(this.input);
    playerController.on('command', command => this.handleInput(command));
    this.playerController = playerController;

    this.turnQueue = createTurnQueue(enemies.concat(player));
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
    if (!this.isActionInProgress) {
      this.updateActors();
    }
    this.cameraController.update(delta);
    renderUpdated(this, globals.TILE_SIZE);
  }

  updateActors() {
    const currentTurnSlot = this.turnQueue[0];
    const isPlayersTurn = currentTurnSlot.actor === this.gameData.player;

    if (isPlayersTurn) {
      this.playerController.update();
    } else {
      const { gameData, pathfinder } = this;

      if (currentTurnSlot.actor.status !== 'DEAD') {
        const action = decide(currentTurnSlot.actor, gameData, pathfinder);
        const outcome = execute(action);
        this.playbackAction(outcome);
      }

      this.turnQueue = updateTurnQueue(this.turnQueue);
      this.events.emit('turnChange', this.turnQueue);
    }
  }

  handleInput(command) {
    if (this.isActionInProgress) {
      return;
    }

    const action = performPlayerCommand(command, this.gameData);

    if (!action) {
      return;
    }

    this.isActionInProgress = true;

    if (action.type === 'STAIRS_DOWN') {
      this.gameData.dungeon.descend();

      this.cameras.main.once(
        'camerafadeoutcomplete',
        () => {
          this.isActionInProgress = false;
          this.scene.restart(this.gameData.dungeon);
        },
        this,
      );

      this.cameras.main.fadeOut(1000);

      return;
    }

    if (action.type === 'STAIRS_UP') {
      this.gameData.dungeon.ascend();

      this.cameras.main.once(
        'camerafadeoutcomplete',
        () => {
          this.isActionInProgress = false;
          this.scene.restart(this.gameData.dungeon);
        },
        this,
      );

      this.cameras.main.fadeOut(1000);

      return;
    }

    this.playbackAction(action);

    const { playerContainer } = this.renderData;

    this.cameras.main.startFollow(playerContainer);
  }
}
