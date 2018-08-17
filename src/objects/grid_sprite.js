import Phaser from 'phaser';
import { gridToWorld } from 'backstab/objects/grid/convert';

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
}

export default GridSprite;
