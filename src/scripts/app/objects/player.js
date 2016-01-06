import config from 'app/config';
import GridSprite from 'app/objects/grid_sprite';

class Player extends GridSprite {
	constructor (game, gridX, gridY) {
		super(game, gridX, gridY, 'player');
    this.cursors = game.input.keyboard.createCursorKeys();
	}

  update () {
    this.handleMovement();
  }

  handleMovement() {
    if (this.cursors.up.isDown && this.gridY > 1) {
      this.moveUp();
    } else if (this.cursors.right.isDown && this.gridX < config.MAP_SIZE - 1) {
      this.moveRight();
    } else if (this.cursors.down.isDown && this.gridY < config.MAP_SIZE - 1) {
      this.moveDown();
    } else if (this.cursors.left.isDown && this.gridX > 1) {
      this.moveLeft();
    }
  }

  moveUp() {
    this.gridY--;
  }

  moveDown() {
    this.gridY++;
  }

  moveLeft() {
    this.gridX--;
  }

  moveRight() {
    this.gridX++;
  }
}

export default Player;