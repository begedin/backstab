import config from 'app/config';

class Tile extends Phaser.Sprite {
  constructor (game, terrainType, gridX, gridY) {
    super(game, gridX * config.DESIRED_TILE_SIZE, gridY * config.DESIRED_TILE_SIZE, terrainType.graphic);
    this.scale.setTo(config.SCALE);
  }
}

export default Tile;
