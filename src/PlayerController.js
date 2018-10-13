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
      this.emit('playerUp');
      return;
    }

    if (down.isDown) {
      this.emit('playerDown');
      return;
    }

    if (left.isDown) {
      this.emit('playerLeft');
      return;
    }

    if (right.isDown) {
      this.emit('playerRight');
    }
  }
}

export default PlayerController;
