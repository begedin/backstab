import GridSprite from 'backstab/objects/grid_sprite';
import { Terrain } from 'backstab/enums';

const graphicFromNumber = type => {
  if (type === Terrain.UNUSED) {
    return 'unused';
  }
  if (type === Terrain.DIRT_FLOOR) {
    return 'dirt_floor';
  }
  if (type === Terrain.DIRT_WALL) {
    return 'dirt_wall';
  }
  if (type === Terrain.STONE_WALL) {
    return 'stone_wall';
  }
  if (type === Terrain.DOOR) {
    return 'door';
  }
  if (type === Terrain.CORRIDOR) {
    return 'corridor';
  }

  return null;
};

class Tile extends GridSprite {
  constructor(scene, type, gridX, gridY) {
    const textureKey = graphicFromNumber(type);
    super(scene, gridX, gridY, textureKey);
    this.terrainType = type;
  }

  get isWalkable() {
    return (
      this.terrainType === Terrain.DIRT_FLOOR ||
      this.terrainType === Terrain.DOOR
    );
  }
}

export default Tile;
