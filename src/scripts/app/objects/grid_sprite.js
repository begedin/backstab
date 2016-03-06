import config from 'app/config';

class GridSprite extends Phaser.Sprite {
	constructor(game, gridX, gridY, key, frame) {
    super(game, gridX * config.TILE_SIZE, gridY * config.TILE_SIZE, key, frame);

    this.gridX = gridX;
    this.gridY = gridY;
  }

  get gridX () {
    return this._gridX;
  }

  set gridX (value) {
    this._gridX = value;
    this.x = this._gridX * config.TILE_SIZE;
  }

  get gridY () {
    return this._gridY;
  }

  set gridY (value) {
    this._gridY = value;
    this.y = this._gridY * 32;
  }

  moveUp() {
    this.moveTo({ gridY: this.gridY - 1});
  }

  moveDown() {
    this.moveTo({ gridY: this.gridY + 1});
  }

  moveLeft() {
    this.moveTo({ gridX: this.gridX - 1});
  }

  moveRight() {
    this.moveTo({ gridX: this.gridX + 1});
  }

  moveTo (updatedCoordinates) {
    var tween = this.game.add.tween(this).to(updatedCoordinates, config.BASE_SPEED, Phaser.Easing.Quadratic.In);
    this.startMotion();
    tween.onComplete.add(this.stopMotion, this);
    tween.start();
  }

  startMotion () {
    this.isMoving = true;
  }

  stopMotion () {
    this.isMoving = false;
  }
}

export default GridSprite;
