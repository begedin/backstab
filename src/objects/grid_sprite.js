import Phaser from 'phaser';
import config from 'backstab/config';

class GridSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, gridX, gridY, key, frame) {
    super(
      scene,
      gridX * config.TILE_SIZE,
      gridY * config.TILE_SIZE,
      key,
      frame,
    );

    this.grid = { x: gridX, y: gridY };

    this.gridX = gridX;
    this.gridY = gridY;
  }

  get gridX() {
    return this.grid.x;
  }

  set gridX(value) {
    this.grid.x = value;
    this.x = this.grid.x * config.TILE_SIZE;
  }

  get gridY() {
    return this.grid.y;
  }

  set gridY(value) {
    this.grid.y = value;
    this.y = this.grid.y * 32;
  }

  moveUp() {
    this.moveTo({ gridY: this.gridY - 1 });
  }

  moveDown() {
    this.moveTo({ gridY: this.gridY + 1 });
  }

  moveLeft() {
    this.moveTo({ gridX: this.gridX - 1 });
  }

  moveRight() {
    this.moveTo({ gridX: this.gridX + 1 });
  }

  moveTo(updatedCoordinates) {
    const tween = this.scene.add
      .tween(this)
      .to(updatedCoordinates, config.BASE_SPEED, Phaser.Easing.Quadratic.In);
    this.startMotion();
    tween.onComplete.add(this.stopMotion, this);
    tween.start();
  }

  startMotion() {
    this.isMoving = true;
  }

  stopMotion() {
    this.isMoving = false;
  }
}

export default GridSprite;
