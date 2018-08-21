import Phaser from 'phaser';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Dummy from 'backstab/objects/enemies/dummy';
import Player from 'backstab/objects/player';
import globals from 'backstab/globals';
import Randomizer from 'backstab/helpers/randomizer';
import { Terrain } from 'backstab/enums';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    const rng = new Randomizer();

    const { TILE_SIZE } = globals;
    const MAP_SIZE = 500;

    this.cameras.main.setBounds(
      0,
      0,
      MAP_SIZE * TILE_SIZE,
      MAP_SIZE * TILE_SIZE,
    );

    this.dungeon = new DungeonGenerator(rng, MAP_SIZE, MAP_SIZE);

    const map = this.make.tilemap({
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
      width: this.dungeon.width,
      height: this.dungeon.height,
    });

    const tileset = map.addTilesetImage(
      'tiles',
      'tiles',
      TILE_SIZE,
      TILE_SIZE,
      1,
      2,
    );

    map.createBlankDynamicLayer('Layer 1', tileset);

    this.dungeon.features.forEach(({ points }) => {
      points.forEach(({ x, y, terrain }) => {
        map.putTileAt(terrain, x, y);
      });
    });

    this.enemies = this.spawnEnemies(rng, this.dungeon);

    const player = this.createPlayer(this.dungeon);
    this.player = this.add.existing(player);
    this.cameras.main.startFollow(player);
    this.cameras.main.disableCull = true;
    this.cameras.main.setZoom(0.3);

    const controlConfig = {
      camera: this.cameras.main,
      speed: 0.5,
      disableCull: true,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };

    window.addEventListener(
      'wheel',
      ({ deltaY }) => {
        const camera = this.cameras.main;

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

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  }

  createPlayer(dungeon) {
    const { x, y } = dungeon.startingLocation;
    const player = new Player(this, x, y);
    return player;
  }

  spawnEnemies(rng, dungeon) {
    const enemies = [];
    dungeon.features.forEach(({ points }) => {
      const walkablePoints = points.filter(
        p => p.terrain === Terrain.DIRT_FLOOR || p.terrain === Terrain.DOOR,
      );
      const { x, y } = rng.pick(walkablePoints);
      const enemy = new Dummy(this, x, y);
      enemies.push(this.add.existing(enemy));
    });
    return enemies;
  }

  update(delta) {
    this.handleDrag();
    this.player.update(this.enemies, this.dungeon);
    this.enemies.forEach(e => e.update(delta));
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
}
