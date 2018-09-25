import Phaser from 'phaser';

class Controller extends Phaser.Events.EventEmitter {
  constructor(input) {
    super();

    window.addEventListener(
      'wheel',
      ({ deltaY }) => {
        if (deltaY > 0) {
          this.emit('zoomIn');
        }

        if (deltaY < 0) {
          this.emit('zoomOut');
        }
      },
      false,
    );

    this.input = input;
  }

  update(turnInProgress) {
    const { activePointer } = this.input;

    if (activePointer.isDown) {
      if (this.origDragPoint) {
        const { x: startX, y: startY } = this.origDragPoint;
        const { x: dragX, y: dragY } = activePointer.position;

        const newScrollX = dragX - startX;
        const newScrollY = dragY - startY;

        this.emit('drag', { x: newScrollX, y: newScrollY });
      }

      this.origDragPoint = activePointer.position.clone();
    } else {
      delete this.origDragPoint;
    }

    if (turnInProgress) {
      return;
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

export default Controller;
