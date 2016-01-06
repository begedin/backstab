import config from 'app/config';

class Player extends Phaser.Sprite {
	constructor (game, gridX, gridY) {
		super(game, gridX * config.DESIRED_TILE_SIZE, gridY * config.DESIRED_TILE_SIZE, 'player');
    
    this.gridX = gridX;
    this.gridY = gridY;
   
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

  get gridX () {
    return this._gridX;
  }

  set gridX (value) {
    this._gridX = value;
    this.x = this._gridX * config.DESIRED_TILE_SIZE;
  }

  get gridY () {
    return this._gridY;
  }

  set gridY (value) {
    this._gridY = value;
    this.y = this._gridY * config.DESIRED_TILE_SIZE;
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