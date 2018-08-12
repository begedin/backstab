import Phaser from 'phaser';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Player from 'backstab/objects/player';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  // init() {
  //   this.scene.backgroundColor = '#fffff';
  // }

  create() {
    this.cameras.main.setBounds(0, 0, 500 * 32, 500 * 32);
    const dungeon = new DungeonGenerator(this);
    // const group = new Phaser.GameObjects.Group(this, dungeon.flattenedTiles);
    //
    // this.dungeonTiles = this.add.existing(group);
    //
    dungeon.flattenedTiles.forEach(tile => this.add.existing(tile));

    const player = this.createPlayer(dungeon);
    this.player = this.add.existing(player);
    this.cameras.main.startFollow(player);
    this.cameras.main.disableCull = true;
    // this.game.input.mouse.mouseWheelCallback = mouseEvent => {
    //   this.handleMouseWheel(mouseEvent);
    // };
    //
    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
      disableCull: true,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };

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
    // this.handlePlusMinus();
    // this.handleDrag();
    // this.player.update();
    this.controls.update(delta);
  }

  changeZoom(amount) {
    const maxScale = 5;
    const minScale = 0.2;
    const currentScale = this.camera.scale.x;
    let newScale = currentScale + amount;
    if (newScale > maxScale) {
      newScale = maxScale;
    } else if (newScale < minScale) {
      newScale = minScale;
    }

    if (currentScale !== newScale) {
      this.camera.scale.setTo(newScale, newScale);
    }
  }

  handleMouseWheel() {
    const delta = this.input.mouse.wheelDelta;
    this.changeZoom(delta * 0.2);
  }

  handlePlusMinus() {
    const plusKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Plus,
    );
    const numpadPlusKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.NumpadPlus,
    );
    const minusKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Minus,
    );
    const numpadMinusKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.NumpadMinus,
    );

    if (plusKey.isDown || numpadPlusKey.isDown) {
      this.changeZoom(0.02);
    } else if (minusKey.isDown || numpadMinusKey.isDown) {
      this.changeZoom(-0.02);
    }
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
