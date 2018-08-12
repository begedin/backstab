import Randomizer from 'backstab/helpers/randomizer';
import Room from 'backstab/objects/dungeon/features/room';
import { Terrain, Direction } from 'backstab/enums';
import Tile from 'backstab/objects/tile';
import { cloneArray, flatten2DArray } from 'backstab/helpers/array';

const createEmptyMap = (width, height) =>
  [...Array(height)].map(y =>
    [...Array(width)].map(x => {
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

const generateTiles = (map, scene) =>
  map.map((row, gridX) =>
    row.map((type, gridY) => {
      if (type) {
        return new Tile(scene, type, gridX, gridY);
      }
      return null;
    }),
  );

class Generator {
  constructor(scene) {
    const FEATURE_COUNT = 10;
    const MAP_SIZE = 500;
    const MAX_ATTEMPTS = 20;

    const rng = new Randomizer();

    // huge square map with stone wall edges
    const emptyMap = createEmptyMap(MAP_SIZE, MAP_SIZE);

    // initial room for the map
    const initialRoom = new Room(rng, MAP_SIZE / 2, MAP_SIZE / 2);

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

    // placing feature tiles onto the map
    const mapWithFeatures = placeFeatures(emptyMap, features);
    // generating tiles (for adding tile sprites later)
    const tiles = generateTiles(mapWithFeatures, scene);

    this.rng = rng;
    this.features = features;
    this.map = mapWithFeatures;
    this.tiles = tiles;

    this.startingLocation = { x: MAP_SIZE / 2, y: MAP_SIZE / 2 };
  }

  get flattenedTiles() {
    return flatten2DArray(this.tiles).filter(x => !!x);
  }

  get firstWalkableTile() {
    return this.flattenedTiles.find(tile => tile.isWalkable === true);
  }

  tileAt(x, y) {
    return this.tiles[x][y];
  }
}

export default Generator;
