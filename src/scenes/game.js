import Phaser from 'phaser';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Dummy from 'backstab/objects/enemies/dummy';
import Palantir from 'backstab/objects/enemies/palantir';
import Player from 'backstab/objects/player';
import globals from 'backstab/globals';
import Randomizer from 'backstab/helpers/randomizer';

import { gridToWorld } from 'backstab/objects/grid/convert';
import { meleeAttackTween, moveTween } from 'backstab/objects/action_tweens';
import { renderInitial, renderUpdated } from 'backstab/objects/renderer';

const setupCamera = (camera, tileSize, mapSize, { x, y }) => {
  const worldSize = tileSize * mapSize;
  camera.setBounds(0, 0, worldSize, worldSize);
  camera.setRoundPixels(true);
  camera.setScroll(gridToWorld(x), gridToWorld(y));
  // camera.disableCull = true;
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

const setupMouseScrollControl = camera => {
  window.addEventListener(
    'wheel',
    ({ deltaY }) => {
      const currentZoomIndex = ZOOM_LEVELS.indexOf(camera.zoom);

      if (deltaY > 0 && currentZoomIndex < ZOOM_LEVELS.length - 1) {
        camera.zoomTo(ZOOM_LEVELS[currentZoomIndex + 1], 250);
      }

      if (deltaY < 0 && currentZoomIndex > 0) {
        camera.zoomTo(ZOOM_LEVELS[currentZoomIndex - 1], 250);
      }
    },
    false,
  );
};

const getPlayerCommand = ({ up, down, left, right }) => {
  if (up.isDown) {
    return 'UP';
  }

  if (down.isDown) {
    return 'DOWN';
  }

  if (left.isDown) {
    return 'LEFT';
  }

  if (right.isDown) {
    return 'RIGHT';
  }

  return false;
};

const tickTurn = gameData =>
  gameData.enemies.forEach(e => e.update && e.update(gameData));

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
    super('game');
  }

  create() {
    const rng = new Randomizer();

    const { TILE_SIZE } = globals;
    const mapSize = 500;
    const { dungeon, player, enemies } = spawn(rng, TILE_SIZE, mapSize);
    this.gameData = { player, dungeon, enemies };

    // setting up camera
    const { main: camera } = this.cameras;
    setupCamera(camera, TILE_SIZE, mapSize, dungeon.startingLocation);
    setupMouseScrollControl(camera);
    // setting up controls
    const { keyboard } = this.input;
    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    const { playerSprite, enemySprites, dungeonTileMap } = renderInitial(
      this,
      this.gameData,
      TILE_SIZE,
      500,
    );
    this.playerSprite = playerSprite;
    this.enemySprites = enemySprites;
    this.dungeonTileMap = dungeonTileMap;
  }

  update(delta) {
    this.handleDrag();

    let playerAction;

    if (!this.lockedFromInput) {
      playerAction = this.handlePlayerInput();
    }

    if (playerAction) {
      tickTurn(this.gameData);
    }

    const { TILE_SIZE } = globals;
    renderUpdated(this, this.gameData, TILE_SIZE);

    this.controls.update(delta);
  }

  handleDrag() {
    const { activePointer } = this.input;

    if (activePointer.isDown) {
      this.cameras.main.stopFollow();

      if (this.origDragPoint) {
        const { scrollX, scrollY } = this.cameras.main;
        const { x: startX, y: startY } = this.origDragPoint;
        const { x: dragX, y: dragY } = activePointer.position;

        const newScrollX = scrollX - (dragX - startX);
        const newScrollY = scrollY - (dragY - startY);

        this.cameras.main.setScroll(newScrollX, newScrollY);
      }
      this.origDragPoint = activePointer.position.clone();
    } else {
      delete this.origDragPoint;
    }
  }

  handlePlayerInput() {
    const command = getPlayerCommand(this.input.keyboard.createCursorKeys());

    if (!command) {
      return false;
    }

    const {
      gameData,
      gameData: { player },
    } = this;
    const result = player.command(command, gameData);

    if (!result) {
      return null;
    }

    this.cameras.main.startFollow(this.playerSprite);
    this.lockedFromInput = true;

    const timeline = this.tweens.createTimeline();

    // player action
    const { type } = result;

    if (type === 'ATTACKING') {
      const { data: enemy } = result;
      timeline.add(meleeAttackTween(player, enemy));
      enemy.damage(player.meleeAttack);
    }

    if (type === 'MOVING') {
      const { data } = result;
      timeline.add(moveTween(player, data));
    }

    timeline.play();

    timeline.setCallback('onComplete', () => {
      this.lockedFromInput = false;
    });

    return result;
  }
}
