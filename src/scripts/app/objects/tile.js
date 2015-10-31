var TILE_SIZE = 20;

class Tile extends Phaser.Sprite {
  constructor (game, terrainType, gridX, gridY) {
    super(game, gridX * TILE_SIZE, gridY * TILE_SIZE, terrainType.graphic);
  }
}

export default Tile;
