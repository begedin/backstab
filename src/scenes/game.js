import Phaser from 'phaser';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Dummy from 'backstab/objects/enemies/dummy';
import Palantir from 'backstab/objects/enemies/palantir';
import Player from 'backstab/objects/player';
import globals from 'backstab/globals';
import Randomizer from 'backstab/helpers/randomizer';
import Controller from 'backstab/objects/controller';
import { gridToWorld } from 'backstab/objects/grid/convert';
import { meleeAttackTween, moveTween } from 'backstab/objects/action_tweens';
import { renderInitial, renderUpdated } from 'backstab/objects/renderer';

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

const spawnDungeon = (rng, mapSize) =>
  new DungeonGenerator(rng, mapSize, mapSize);

const spawn = (rng, tileSize, mapSize) => {
  // spawning everything
  const dungeon = spawnDungeon(rng, mapSize);
  const { startingLocation } = dungeon;
  const player = new Player(startingLocation.x, startingLocation.y);
  const enemies = dungeon.features.map(feature => {
    const { x, y } = rng.pick(feature.innerPoints);

    const enemy =
      rng.pick([1, 2]) === 1
        ? new Dummy(feature, x, y)
        : new Palantir(rng, feature, x, y);

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
    const rng = new Randomizer();
    this.scene.launch('GameUI');

    const { TILE_SIZE } = globals;
    const mapSize = 500;
    const { dungeon, player, enemies } = spawn(rng, TILE_SIZE, mapSize);
    this.gameData = { player, dungeon, enemies };

    // setting up camera
    const { main: camera } = this.cameras;
    setupCamera(camera, TILE_SIZE, mapSize, dungeon.startingLocation);

    const { playerSprite, enemySprites, dungeonTileMap } = renderInitial(
      this,
      this.gameData,
      TILE_SIZE,
      500,
    );
    this.playerSprite = playerSprite;
    this.enemySprites = enemySprites;
    this.dungeonTileMap = dungeonTileMap;

    // setting up controls
    const { keyboard } = this.input;
    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    const controller = new Controller(this.input);

    controller.on('zoomIn', () => zoomIn(camera));
    controller.on('zoomOut', () => zoomOut(camera));
    controller.on('drag', amount => scrollCamera(camera, amount));
    controller.on('playerUp', () => this.handlePlayerInput('UP'));
    controller.on('playerDown', () => this.handlePlayerInput('DOWN'));
    controller.on('playerLeft', () => this.handlePlayerInput('LEFT'));
    controller.on('playerRight', () => this.handlePlayerInput('RIGHT'));

    this.controller = controller;
  }

  update(delta) {
    this.controller.update(this.turnInProgress);

    const { TILE_SIZE } = globals;
    renderUpdated(this, this.gameData, TILE_SIZE);

    this.controls.update(delta);
  }

  handlePlayerInput(command) {
    const { gameData } = this;
    const { player } = gameData;

    const action = player.command(command, gameData);
    if (!action) {
      return;
    }

    const { type } = action;
    const timeline = this.tweens.createTimeline();

    if (type === 'ATTACKING') {
      const { data: enemy } = action;
      timeline.add(meleeAttackTween(player, enemy));
      enemy.damage(player.meleeAttack);
    }

    if (type === 'MOVING') {
      const { data } = action;
      timeline.add(moveTween(player, data));
    }

    timeline.play();

    timeline.setCallback('onComplete', () => {
      this.turnInProgress = false;
    });

    gameData.enemies.forEach(e => e.update && e.update(gameData));

    this.cameras.main.startFollow(this.playerSprite);
    this.turnInProgress = true;
  }
}
