import Phaser from 'phaser';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Dummy from 'backstab/objects/enemies/dummy';
import Player from 'backstab/objects/player';
import globals from 'backstab/globals';
import Randomizer from 'backstab/helpers/randomizer';

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

const createPlayer = (scene, dungeon) => {
  const { x, y } = dungeon.startingLocation;
  return new Player(scene, x, y);
};

const spawnEnemies = (rng, scene, dungeon) =>
  dungeon.features.map(({ innerPoints }) => {
    const { x, y } = rng.pick(innerPoints);
    return new Dummy(scene, x, y);
  });

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    const rng = new Randomizer();

    const { TILE_SIZE, MAP_SIZE } = globals;
    const { main: camera } = this.cameras;

    setupCamera(camera, globals);

    const dungeon = new DungeonGenerator(rng, MAP_SIZE, MAP_SIZE);
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

    const enemies = spawnEnemies(rng, this, dungeon);
    const player = createPlayer(this, dungeon);

    this.dungeon = dungeon;
    this.player = this.add.existing(player);
    this.enemies = enemies.map(e => this.add.existing(e));

    camera.startFollow(player);
    camera.disableCull = true;
    camera.setZoom(0.3);

    const { keyboard } = this.input;

    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    setupMouseScrollControl(camera);
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
