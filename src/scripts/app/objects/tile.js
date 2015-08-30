import { Terrains } from 'app/enums/terrain';

var TILE_SIZE = 32;

class Tile extends Phaser.Sprite {
  constructor (game, terrainType, gridX, gridY) {
    super(game, gridX * 32, gridY * 32, terrainType.graphic);
  }
}

export default Tile;
