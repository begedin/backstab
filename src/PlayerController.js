import Phaser from 'phaser';

class PlayerController extends Phaser.Events.EventEmitter {
  constructor(input) {
    super();
    this.input = input;
  }

  update() {
    const space = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    if (space.isDown) {
      this.emit('playerWait');
    }

    const { up, down, left, right } = this.input.keyboard.createCursorKeys();

    if (up.isDown) {
      this.emit('command', 'UP');
      return;
    }

    if (down.isDown) {
      this.emit('command', 'DOWN');
      return;
    }

    if (left.isDown) {
      this.emit('command', 'LEFT');
      return;
    }

    if (right.isDown) {
      this.emit('command', 'RIGHT');
    }

    if (this.input.keyboard.addKey(190).isDown) {
      this.emit('command', 'DOWN_STAIRS');
    }

    if (this.input.keyboard.addKey(188).isDown) {
      this.emit('command', 'UP_STAIRS');
    }
  }
}

export default PlayerController;
