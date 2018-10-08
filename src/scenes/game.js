import Phaser from 'phaser';

import * as Random from 'backstab/Random';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Attacker from 'backstab/objects/enemies/Attacker';
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
import { enterPosition, wait } from 'backstab/behavior/actions';

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

    let enemy;
    switch (Random.pick([1, 2, 3])) {
      case 1:
        enemy = new Dummy(feature, x, y, Phaser.Utils.String.UUID());
        break;
      case 2:
        enemy = new Palantir(feature, x, y, Phaser.Utils.String.UUID());
        break;
      case 3:
        enemy = new Attacker(feature, x, y, Phaser.Utils.String.UUID());
        break;
      default:
        break;
    }
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
    case 'WAIT':
      return wait(player);
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
    controller.on('playerWait', () => this.handleInput('WAIT'));

    this.controller = controller;

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
      const { target: gridLocation } = outcome;
      const { playerContainer } = this.renderData;
      const { x, y } = {
        x: gridToWorld(gridLocation.x),
        y: gridToWorld(gridLocation.y),
      };

      timeline.add(moveTween(playerContainer, { x, y }));
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

    if (!isPlayersTurn && !this.isActionInProgress) {
      const { gameData, currentTurnSlot } = this;
      const action = currentTurnSlot.actor.act(gameData);
      if (action) {
        this.playbackAction(action);
      } else {
        this.turnQueue = updateTurnQueue(this.turnQueue);
        this.events.emit('turnChange', this.turnQueue);
      }
    }

    this.controller.update(isPlayersTurn);
    this.controls.update(delta);

    renderUpdated(this, globals.TILE_SIZE);
  }

  handleInput(command) {
    if (this.isActionInProgress) {
      return;
    }

    const action = getPlayerAction(command, this.gameData);

    if (!action) {
      return;
    }

    this.playbackAction(action);

    const { playerContainer } = this.renderData;

    this.cameras.main.startFollow(playerContainer);
  }
}
