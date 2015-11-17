var DESIRED_TILE_SIZE = 16;
var ACTUAL_TILE_SIZE = 32;
var SCALE = DESIRED_TILE_SIZE / ACTUAL_TILE_SIZE;


class Tile extends Phaser.Sprite {
  constructor (game, terrainType, gridX, gridY) {
    super(game, gridX * DESIRED_TILE_SIZE, gridY * DESIRED_TILE_SIZE, terrainType.graphic);
    this.scale.setTo(SCALE, SCALE);
  }
}

export default Tile;
