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
    const tween = this.scene.tweens.add({
      targets: this,
      gridX: {
        getStart: () => this.gridX,
        getEnd: () => gridX
      },
      gridY: {
        getStart: () => this.gridY,
        getEnd: () => gridY
      },
      ease: 'Sine.easeIn',
      duration: config.BASE_SPEED,
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
