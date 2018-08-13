import Phaser from 'phaser';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Player from 'backstab/objects/player';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    this.cameras.main.setBounds(0, 0, 500 * 32, 500 * 32);
    const dungeon = new DungeonGenerator(this);
    dungeon.flattenedTiles.forEach(tile => this.add.existing(tile));

    const player = this.createPlayer(dungeon);
    this.player = this.add.existing(player);
    this.cameras.main.startFollow(player);
    this.cameras.main.disableCull = true;

    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
      camera: this.cameras.main,
      speed: 0.5,
      disableCull: true,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };

    window.addEventListener('wheel', ({ deltaY }) => {
      const camera = this.cameras.main;

      const zoomIn = 1.5;
      const zoomOut = 1 / zoomIn;

      if (deltaY > 0) {
        camera.zoomTo(camera.zoom * zoomOut, 250);
      } else {

        camera.zoomTo(camera.zoom * zoomIn, 250);
      }
    }, false)

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  }

  createPlayer(dungeon) {
    const playerPosition = dungeon.startingLocation;
    const player = new Player(
      this,
      dungeon,
      playerPosition.x,
      playerPosition.y,
    );
    return player;
  }

  update(delta) {
    this.handleDrag();
    this.player.update();
    this.controls.update(delta);
  }

  handleDrag() {
    if (this.input.activePointer.isDown) {
      this.cameras.main.stopFollow();
      if (this.origDragPoint) {
        // move the camera by the amount the mouse has moved since last update
        const x =
          this.cameras.main.x +
          this.origDragPoint.x -
          this.input.activePointer.position.x;
        const y =
          this.cameras.main.y +
          this.origDragPoint.y -
          this.input.activePointer.position.y;
        this.cameras.main.setPosition(x, y);
      }
      // set new drag origin to current position
      this.origDragPoint = this.input.activePointer.position.clone();
    } else {
      this.origDragPoint = null;
    }
  }
}
