import GridSprite from 'app/objects/grid_sprite';
import { Terrain } from 'app/enums';

function graphicFromNumber(type) {
  if (type === Terrain.UNUSED) {
    return 'unused';
  } else if (type === Terrain.DIRT_FLOOR) {
    return 'dirt_floor';
  } else if (type === Terrain.DIRT_WALL) {
    return 'dirt_wall';
  } else if (type === Terrain.STONE_WALL) {
    return 'stone_wall';
  } else if (type === Terrain.DOOR) {
    return 'door';
  }
}

class Tile extends GridSprite {
  constructor (game, type, gridX, gridY) {
    super(game, gridX, gridY, graphicFromNumber(type));
    this.terrainType = type;
  }

  get isWalkable() {
  	return this.terrainType === Terrain.DIRT_FLOOR || this.terrainType === Terrain.DOOR;
  }
}

export default Tile;
