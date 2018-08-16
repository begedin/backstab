import Randomizer from 'backstab/helpers/randomizer';
import Room from 'backstab/objects/dungeon/features/room';
import { Terrain } from 'backstab/enums';
import { cloneArray, flatten2DArray } from 'backstab/helpers/array';

const createEmptyMap = (width, height) =>
  [...Array(height)].map(x =>
    [...Array(width)].map(y => {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        return Terrain.STONE_WALL;
      }
      return Terrain.UNUSED;
    }),
  );

const canPlaceFeature = (features, { points }) => {
  const takenPoints = flatten2DArray(features.map(f => f.points));
  return points.every(
    point => !takenPoints.some(p => p.x === point.x && p.y === point.y),
  );
};

const placeFeatures = (emptyMap, features) => {
  const map = cloneArray(emptyMap);

  features.forEach(({ points }) => {
    points.forEach(({ x, y, terrain }) => {
      map[x][y] = terrain;
    });
  });

  return map;
};

const tryGenerateFeature = (rng, existingFeatures) => {
  const feature = rng.pick(existingFeatures);
  const anchor = rng.pick(feature.anchors);

  if (!anchor) {
    return null;
  }

  const room = new Room(rng, anchor.x, anchor.y, anchor.direction);

  if (!canPlaceFeature(existingFeatures, room)) {
    return false;
  }

  feature.createDoor(anchor);

  return room;
};

class Generator {
  constructor(width, height) {
    const FEATURE_COUNT = 10;
    const MAX_ATTEMPTS = 20;

    const rng = new Randomizer();

    // initial room for the map
    const initialRoom = new Room(rng, width / 2, height / 2);

    const features = [initialRoom];
    let attempts = 0;

    // remaining features for the map
    while (features.length < FEATURE_COUNT && attempts <= MAX_ATTEMPTS) {
      const feature = tryGenerateFeature(rng, features);
      if (feature) {
        features.push(feature);
      }
      attempts += 1;
    }

    this.rng = rng;
    this.features = features;

    const emptyMap = createEmptyMap(width, height);
    this.map = placeFeatures(emptyMap, features);

    this.startingLocation = { x: width / 2, y: height / 2 };

    this.width = width;
    this.height = height;
  }

  get flattenedMap() {
    return flatten2DArray(this.map);
  }

  get firstWalkableTile() {
    return this.flattenedTiles.find(tile => tile.isWalkable === true);
  }

  tileAt(x, y) {
    return this.map[x][y];
  }
}

export default Generator;
