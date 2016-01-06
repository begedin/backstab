import GridSprite from 'app/objects/grid_sprite';
import { Terrains } from 'app/enums/terrain';

class Tile extends GridSprite {
  constructor (game, terrainType, gridX, gridY) {
    super(game, gridX, gridY, terrainType.graphic);
    this.terrainType = terrainType;
  }

  get isWalkable() {
  	return this.terrainType === Terrains.FLOOR;
  }
}

export default Tile;
