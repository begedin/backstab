import config from 'app/config';

class GridSprite extends Phaser.Sprite {
	constructor(game, gridX, gridY, key, frame) {
    super(game, gridX * config.DESIRED_TILE_SIZE, gridY * config.DESIRED_TILE_SIZE, key, frame);

    this.gridX = gridX;
    this.gridY = gridY;
 
    this.scale.setTo(config.SCALE);
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
}

export default GridSprite;