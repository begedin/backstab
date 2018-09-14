import Phaser from 'phaser';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Dummy from 'backstab/objects/enemies/dummy';
import Palantir from 'backstab/objects/enemies/palantir';
import Player from 'backstab/objects/player';
import globals from 'backstab/globals';
import Randomizer from 'backstab/helpers/randomizer';

import { gridToWorld } from 'backstab/objects/grid/convert';
import { meleeAttackTween, moveTween } from 'backstab/objects/action_tweens';

const setupCamera = (camera, { TILE_SIZE, MAP_SIZE }) => {
  const worldSize = TILE_SIZE * MAP_SIZE;
  camera.setBounds(0, 0, worldSize, worldSize);
};

const buildTilemapConfig = ({ TILE_SIZE, MAP_SIZE }) => ({
  tileWidth: TILE_SIZE,
  tileHeight: TILE_SIZE,
  width: MAP_SIZE,
  height: MAP_SIZE,
});

const buildControlConfig = (camera, keyboard) => ({
  camera,
  speed: 0.5,
  disableCull: true,
  zoomIn: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
  zoomOut: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
});

const setupMouseScrollControl = camera => {
  window.addEventListener(
    'wheel',
    ({ deltaY }) => {
      const zoomIn = 1.5;
      const zoomOut = 1 / zoomIn;

      if (deltaY > 0) {
        camera.zoomTo(camera.zoom * zoomOut, 250);
      } else {
        camera.zoomTo(camera.zoom * zoomIn, 250);
      }
    },
    false,
  );
};

const spawnDungeon = (rng, { MAP_SIZE }) =>
  new DungeonGenerator(rng, MAP_SIZE, MAP_SIZE);

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

const computeLineOfSightGraphic = (graphics, enemy) => {
  const { TILE_SIZE } = globals;
  graphics.clear();

  if (enemy.isAlerted) {
    graphics.fillStyle(0xff0000, 1);
  } else {
    graphics.fillStyle(0xff700b, 1);
  }

  graphics.beginPath();
  enemy.seenPoints.forEach(({ x: vx, y: vy }) =>
    graphics.fillRect(
      gridToWorld(vx) - TILE_SIZE / 2,
      gridToWorld(vy) - TILE_SIZE / 2,
      TILE_SIZE,
      TILE_SIZE,
    ),
  );
  graphics.closePath();
  graphics.fillPath();
  return graphics;
};

const tickTurn = gameData =>
  gameData.enemies.forEach(e => e.update && e.update(gameData));

const renderState = (scene, gameData) => {
  const { playerSprite, enemySprites } = scene;
  const { player, enemies } = gameData;

  playerSprite.setPosition(gridToWorld(player.x), gridToWorld(player.y));

  enemies.forEach(enemy => {
    const index = enemies.indexOf(enemy);
    const sprite = enemySprites[index];

    if (enemy.status === 'DEAD') {
      sprite.destroy();
      sprite.lineOfSight.destroy();
    } else {
      computeLineOfSightGraphic(sprite.lineOfSight, enemy);
      sprite.setPosition(gridToWorld(enemy.x), gridToWorld(enemy.y));
    }
  });
};

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    const rng = new Randomizer();

    // spawning everything
    const dungeon = spawnDungeon(rng, globals);
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

    this.gameData = { player, dungeon, enemies };

    this.renderDungeon();
    this.renderInitialState();

    // setting up camera
    const { main: camera } = this.cameras;
    setupCamera(camera, globals);
    setupMouseScrollControl(camera);
    const { x, y } = dungeon.startingLocation;
    camera.setScroll(gridToWorld(x), gridToWorld(y));
    camera.disableCull = true;
    camera.setZoom(0.3);

    // setting up controls
    const { keyboard } = this.input;

    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
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

    renderState(this, this.gameData);

    this.controls.update(delta);
  }

  renderDungeon() {
    const { TILE_SIZE } = globals;
    const tilemapConfig = buildTilemapConfig(globals);
    this.dungeonTileMap = this.make.tilemap(tilemapConfig);
    const tileset = this.dungeonTileMap.addTilesetImage(
      'tiles',
      'tiles',
      TILE_SIZE,
      TILE_SIZE,
      1,
      2,
    );
    this.dungeonTileMap.createBlankDynamicLayer('Layer 1', tileset);

    const { gameData } = this;
    const { dungeon, enemies } = gameData;

    dungeon.features.forEach(({ points }) => {
      points.forEach(({ x, y, terrain }) => {
        this.dungeonTileMap.putTileAt(terrain, x, y);
      });
    });

    this.enemySprites = [];

    enemies.forEach(e => {
      const sprite = this.add.sprite(
        gridToWorld(e.x),
        gridToWorld(e.y),
        e.name,
      );

      sprite.lineOfSight = computeLineOfSightGraphic(this.add.graphics(), e);

      this.enemySprites.push(sprite);
    });
  }

  renderInitialState() {
    const { gameData } = this;
    const { dungeon } = gameData;
    const { startingLocation: playerPosition } = dungeon;

    this.playerSprite = this.add.sprite(
      gridToWorld(playerPosition.x),
      gridToWorld(playerPosition.y),
      'player',
    );
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
