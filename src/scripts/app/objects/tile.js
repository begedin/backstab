import GridSprite from 'app/objects/grid_sprite';

class Tile extends GridSprite {
  constructor (game, terrainType, gridX, gridY) {
    super(game, gridX, gridY, terrainType.graphic);
  }
}

export default Tile;
