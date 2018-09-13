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
      return rng.pick([1, 2]) === 1
        ? new Dummy(feature, x, y)
        : new Palantir(this, rng, feature, x, y);
    });

    this.gameData = { player, dungeon, enemies };

    // drawing dungeon

    const { TILE_SIZE } = globals;
    const tilemapConfig = buildTilemapConfig(globals);
    const map = this.make.tilemap(tilemapConfig);
    const tileset = map.addTilesetImage(
      'tiles',
      'tiles',
      TILE_SIZE,
      TILE_SIZE,
      1,
      2,
    );
    map.createBlankDynamicLayer('Layer 1', tileset);

    dungeon.features.forEach(({ points }) => {
      points.forEach(({ x, y, terrain }) => {
        map.putTileAt(terrain, x, y);
      });
    });

    // drawing player

    this.playerSprite = this.add.sprite(
      gridToWorld(player.x),
      gridToWorld(player.y),
      'player',
    );

    // drawing enemies
    this.enemySprites = enemies.map(e => {
      const sprite = this.add.sprite(
        gridToWorld(e.x),
        gridToWorld(e.y),
        e.name,
      );
      // const losConfig = e.seenPoints.map(p => ({
      //   x: gridToWorld(p.x),
      //   y: gridToWorld(p.y),
      //   key: 'los',
      // }));
      //
      // console.log(sprite.x, sprite.y, losConfig);
      // if (losConfig.length > 0) {
      //   sprite.lineOfSight = this.add.group(losConfig);
      // } else {
      //   sprite.lineOfSight = this.add.group();
      // }

      sprite.lineOfSight = [];
      e.seenPoints.forEach(p =>
        sprite.lineOfSight.push(
          this.add.sprite(gridToWorld(p.x), gridToWorld(p.y), 'los'),
        ),
      );
      return sprite;
    });

    // setting up camera
    const { main: camera } = this.cameras;
    setupCamera(camera, globals);
    setupMouseScrollControl(camera);
    camera.startFollow(this.playerSprite);
    camera.disableCull = true;
    camera.setZoom(0.3);

    // setting up controls
    const { keyboard } = this.input;

    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  }

  update(delta) {
    this.handleDrag();
    const {
      gameData: { player },
    } = this;

    if (!this.lockedFromInput) {
      this.handlePlayerInput();
    }

    this.playerSprite.setPosition(gridToWorld(player.x), gridToWorld(player.y));
    const {
      gameData: { enemies },
      enemySprites,
    } = this;
    enemies.forEach(enemy => {
      const index = enemies.indexOf(enemy);
      const sprite = enemySprites[index];
      if (enemy.status === 'DEAD') {
        sprite.destroy();
      }
      sprite.setPosition(gridToWorld(enemy.x), gridToWorld(enemy.y));
    });

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
      return false;
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

    return true;
  }
}
