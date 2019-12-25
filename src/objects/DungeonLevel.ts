import Feature, { DungeonPoint, DungeonTile, DungeonObject } from '@/objects/dungeon/feature';
import Entity from '@/Entity';

class DungeonLevel {
  startingLocation: DungeonPoint;
  stairsDownLocation: DungeonPoint;
  features: Feature[];
  enemies: Entity[];
  width: integer;
  height: integer;

  constructor(
    startingLocation: DungeonPoint,
    stairsDownLocation: DungeonPoint,
    features: Feature[],
    width: integer,
    height: integer,
  ) {
    this.startingLocation = startingLocation;
    this.stairsDownLocation = stairsDownLocation;
    this.features = features;
    this.width = width;
    this.height = height;
    this.enemies = [];
  }

  tileAt(x: integer, y: integer): DungeonTile | undefined {
    const feature = this.features.find(f => f.contains({ x, y }));
    return feature && feature.getPoint({ x, y });
  }

  objectAt(x: integer, y: integer): DungeonObject | undefined {
    const feature = this.features.find(f => f.contains({ x, y }));
    return feature && feature.getObject({ x, y });
  }
}

// used by easystar. Since the algorithm expects coordinates as a [y][x] grid
// we build a transposed grid
const getGrid = (dungeon: DungeonLevel, size = 500): integer[][] => {
  const grid: integer[][] = [];
  for (let j = 0; j < size; j += 1) {
    grid[j] = [];
    for (let i = 0; i < size; i += 1) {
      const tile = dungeon.tileAt(i, j);
      if (tile && tile.terrain) {
        grid[j][i] = tile.terrain;
      } else {
        grid[j][i] = -1;
      }
    }
  }
  return grid;
};

export { getGrid };
export default DungeonLevel;
