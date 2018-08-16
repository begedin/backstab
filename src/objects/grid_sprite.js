import Phaser from 'phaser';
import globals from 'backstab/globals';

const { BASE_SPEED, TILE_SIZE } = globals;

const gridToWorld = x => x * TILE_SIZE + Math.floor(TILE_SIZE / 2);

class GridSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, gridX, gridY, key, frame) {
    super(scene, gridToWorld(gridX), gridToWorld(gridY), key, frame);

    this.grid = { x: gridX, y: gridY };

    this.gridX = gridX;
    this.gridY = gridY;
  }

  get gridX() {
    return this.grid.x;
  }

  set gridX(value) {
    this.grid.x = value;
    this.x = gridToWorld(value);
  }

  get gridY() {
    return this.grid.y;
  }

  set gridY(value) {
    this.grid.y = value;
    this.y = gridToWorld(value);
  }

  moveUp() {
    this.moveTo({ gridX: this.gridX, gridY: this.gridY - 1 });
  }

  moveDown() {
    this.moveTo({ gridX: this.gridX, gridY: this.gridY + 1 });
  }

  moveLeft() {
    this.moveTo({ gridX: this.gridX - 1, gridY: this.gridY });
  }

  moveRight() {
    this.moveTo({ gridX: this.gridX + 1, gridY: this.gridY });
  }

  moveTo({ gridX, gridY }) {
    this.scene.tweens.add({
      targets: this,
      gridX,
      gridY,
      ease: 'Sine.easeIn',
      duration: BASE_SPEED,
      onStart: () => {
        this.startMotion();
      },
      onComplete: () => {
        this.stopMotion();
      },
    });
  }

  startMotion() {
    this.isMoving = true;
  }

  stopMotion() {
    this.isMoving = false;
  }
}

export default GridSprite;
