import Phaser from 'phaser';

import * as Random from 'backstab/Random';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Dummy from 'backstab/objects/enemies/Dummy';
import Palantir from 'backstab/objects/enemies/Palantir';
import Player from 'backstab/objects/Player';
import globals from 'backstab/globals';
import Controller from 'backstab/objects/controller';
import { gridToWorld } from 'backstab/objects/grid/convert';
import {
  bumpTween,
  damageEffectTween,
  moveTween,
} from 'backstab/objects/actionTweens';
import { renderInitial, renderUpdated } from 'backstab/renderers/entities';
import { enterPosition } from 'backstab/behavior/actions';

const setupCamera = (camera, tileSize, mapSize, { x, y }) => {
  const worldSize = tileSize * mapSize;
  camera.setBounds(0, 0, worldSize, worldSize);
  camera.setRoundPixels(true);
  camera.setScroll(gridToWorld(x), gridToWorld(y));
  camera.setZoom(1 / 2);
};

const buildControlConfig = (camera, keyboard) => ({
  camera,
  speed: 0.5,
  disableCull: true,
  zoomIn: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
  zoomOut: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
});

const ZOOM_LEVELS = [1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2];

const zoomIn = camera => {
  const currentZoomIndex = ZOOM_LEVELS.indexOf(camera.zoom);
  if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
    camera.zoomTo(ZOOM_LEVELS[currentZoomIndex + 1], 250);
  }
};

const zoomOut = camera => {
  const currentZoomIndex = ZOOM_LEVELS.indexOf(camera.zoom);
  if (currentZoomIndex > 0) {
    camera.zoomTo(ZOOM_LEVELS[currentZoomIndex - 1], 250);
  }
};

const scrollCamera = (camera, { x, y }) => {
  camera.stopFollow();
  camera.setScroll(camera.scrollX - x, camera.scrollY - y);
};

const spawnDungeon = mapSize => new DungeonGenerator(mapSize, mapSize);

const spawn = (tileSize, mapSize) => {
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

    const enemy =
      Random.pick([1, 2]) === 1
        ? new Dummy(feature, x, y, Phaser.Utils.String.UUID())
        : new Palantir(feature, x, y, Phaser.Utils.String.UUID());

    feature.enemies.push(enemy);
    return enemy;
  });

  return { dungeon, enemies, player };
};

const pairWithEnergy = actor => ({ actor, energy: 0 });
const regenerateEnergy = ({ actor, energy }) => ({
  actor,
  energy: energy + actor.rollInitiative(),
});
const compareByEnergy = ({ energy: a }, { energy: b }) => b - a;

const createTurnQueue = actors =>
  actors
    .map(pairWithEnergy)
    .map(regenerateEnergy)
    .sort(compareByEnergy);

const updateTurnQueue = (queue, previousAction = {}) => {
  const { cost = 500 } = previousAction;
  const { actor, energy } = queue[0];
  const newEnergy = energy - cost;
  const unsortedQueue = queue
    .slice(1, queue.length)
    .concat({ actor, energy: energy - cost });

  return newEnergy > 0
    ? unsortedQueue.sort(compareByEnergy)
    : unsortedQueue.map(regenerateEnergy).sort(compareByEnergy);
};

const getCoordinatesFromDirection = ({ x, y }, direction) => {
  switch (direction) {
    case 'UP':
      return { x, y: y - 1 };
    case 'DOWN':
      return { x, y: y + 1 };
    case 'LEFT':
      return { x: x - 1, y };
    case 'RIGHT':
      return { x: x + 1, y };
    default:
      throw new Error('Invalid direction');
  }
};

const getPlayerAction = (command, { player, dungeon, enemies }) => {
  switch (command) {
    case 'UP':
    case 'DOWN':
    case 'LEFT':
    case 'RIGHT':
      return enterPosition(
        player,
        getCoordinatesFromDirection(player, command),
        dungeon,
        enemies,
      );
    default:
      return null;
  }
};

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.scene.launch('GameUI');

    const { TILE_SIZE } = globals;
    const mapSize = 500;
    const { dungeon, player, enemies } = spawn(TILE_SIZE, mapSize);
    this.gameData = { player, dungeon, enemies };

    // setting up camera
    const { main: camera } = this.cameras;
    setupCamera(camera, TILE_SIZE, mapSize, dungeon.startingLocation);

    this.renderData = renderInitial(this, TILE_SIZE, 500);

    // setting up controls
    const { keyboard } = this.input;
    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    const controller = new Controller(this.input);

    controller.on('zoomIn', () => zoomIn(camera));
    controller.on('zoomOut', () => zoomOut(camera));
    controller.on('drag', amount => scrollCamera(camera, amount));
    controller.on('playerUp', () => this.handleInput('UP'));
    controller.on('playerDown', () => this.handleInput('DOWN'));
    controller.on('playerLeft', () => this.handleInput('LEFT'));
    controller.on('playerRight', () => this.handleInput('RIGHT'));

    this.controller = controller;

    this.turnQueue = createTurnQueue(enemies.concat(player));
  }

  get currentTurnSlot() {
    return this.turnQueue[0];
  }

  update(delta) {
    const isPlayersTurn = this.currentTurnSlot.actor === this.gameData.player;

    if (!isPlayersTurn) {
      const { gameData, currentTurnSlot } = this;
      currentTurnSlot.actor.act(gameData);
      this.turnQueue = updateTurnQueue(this.turnQueue);
      this.events.emit('turnChange', this.turnQueue);
    }

    this.controller.update(isPlayersTurn);
    this.controls.update(delta);

    renderUpdated(this, globals.TILE_SIZE);
  }

  handleInput(command) {
    if (this.isPlayerTurnInProgress) {
      return;
    }

    const { gameData, renderData } = this;

    const action = getPlayerAction(command, gameData);
    if (!action) {
      return;
    }

    this.isPlayerTurnInProgress = true;

    const { enemies } = gameData;
    const { playerContainer, enemyContainers } = renderData;

    const timeline = this.tweens.createTimeline();
    const { type, outcome } = action;

    if (type === 'MELEE_ATTACK') {
      const { target: enemy, value } = outcome;
      const index = enemies.indexOf(enemy);
      const enemyContainer = enemyContainers[index];
      const { x, y } = enemyContainer;

      const text = this.add.text(x, y - globals.TILE_SIZE, value);
      text.setOrigin(0.5);
      const tween = this.add.tween(
        damageEffectTween(text, {
          x,
          y: y - 2 * globals.TILE_SIZE,
        }),
      );

      tween.setCallback(
        'onComplete',
        () => {
          text.destroy();
        },
        this,
      );

      timeline.add(bumpTween(playerContainer, enemyContainer));
    }

    if (type === 'MOVE') {
      const { target: gridLocation } = outcome;
      const { x, y } = {
        x: gridToWorld(gridLocation.x),
        y: gridToWorld(gridLocation.y),
      };

      timeline.add(moveTween(playerContainer, { x, y }));
    }

    if (type === 'BUMP') {
      const { target: gridLocation } = outcome;
      const { x, y } = {
        x: gridToWorld(gridLocation.x),
        y: gridToWorld(gridLocation.y),
      };
      timeline.add(bumpTween(playerContainer, { x, y }));
    }

    timeline.setCallback('onComplete', () => {
      this.isPlayerTurnInProgress = false;
      this.turnQueue = updateTurnQueue(this.turnQueue);
      this.events.emit('turnChange', this.turnQueue);
    });

    timeline.play();

    this.cameras.main.startFollow(playerContainer);
  }
}
