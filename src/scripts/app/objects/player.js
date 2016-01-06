var DESIRED_TILE_SIZE = 16;
var ACTUAL_TILE_SIZE = 32;

var SCALE = DESIRED_TILE_SIZE / ACTUAL_TILE_SIZE;

var MAP_SIZE = 64;

class Player extends Phaser.Sprite {
	constructor (game, x, y) {
		super(game, x * DESIRED_TILE_SIZE, y * DESIRED_TILE_SIZE, 'player');
    
    this.gridX = x;
    this.gridY = y;
    this.scale.setTo(SCALE, SCALE);

    this.cursors = game.input.keyboard.createCursorKeys();
	}

  update () {
    this.handleCursorKeys();
  }

  handleCursorKeys() {
    if (this.cursors.up.isDown && this.gridY > 1) {
      this.moveUp();
    } else if (this.cursors.right.isDown && this.gridX < MAP_SIZE - 1) {
      this.moveRight();
    } else if (this.cursors.down.isDown && this.gridY < MAP_SIZE - 1) {
      this.moveDown();
    } else if (this.cursors.left.isDown && this.gridX > 1) {
      this.moveLeft();
    }
  }

  moveUp() {
    this.gridY--;
    this.y = DESIRED_TILE_SIZE * this.gridY;
  }

  moveDown() {
    this.gridY++;
    this.y = DESIRED_TILE_SIZE * this.gridY;
  }

  moveLeft() {
    this.gridX--;
    this.x = DESIRED_TILE_SIZE * this.gridX;
  }

  moveRight() {
    this.gridX++;
    this.x = DESIRED_TILE_SIZE * this.gridX;
  }
}

export default Player;