import config from 'app/config';

class Player extends Phaser.Sprite {
	constructor (game, x, y) {
		super(game, x * config.DESIRED_TILE_SIZE, y * config.DESIRED_TILE_SIZE, 'player');
    
    this.gridX = x;
    this.gridY = y;
    this.scale.setTo(config.SCALE);

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
    this.y = config.DESIRED_TILE_SIZE * this.gridY;
  }

  moveDown() {
    this.gridY++;
    this.y = config.DESIRED_TILE_SIZE * this.gridY;
  }

  moveLeft() {
    this.gridX--;
    this.x = config.DESIRED_TILE_SIZE * this.gridX;
  }

  moveRight() {
    this.gridX++;
    this.x = config.DESIRED_TILE_SIZE * this.gridX;
  }
}

export default Player;