import { Terrain } from 'backstab/enums';
import generateRoom from 'backstab/objects/dungeon/generator/room';
import generateDiamondRoom from 'backstab/objects/dungeon/generator/diamond_room';

const canPlaceFeature = (features, feature) =>
  !features.some(f => f.overlaps(feature));

const tryGenerateFeature = (rng, existingFeatures) => {
  const feature = rng.pick(existingFeatures);
  const anchor = rng.pick(feature.anchors);

  if (!anchor) {
    return null;
  }

  const {
    attachment: { x, y },
    direction,
  } = anchor;

  const newFeature =
    rng.pick([1, 2]) === 1
      ? generateRoom(rng, x, y, direction)
      : generateDiamondRoom(rng, x, y, direction);

  if (!canPlaceFeature(existingFeatures, newFeature)) {
    return false;
  }

  feature.setPoint(anchor, Terrain.DOOR);

  return newFeature;
};

class Generator {
  constructor(rng, width, height) {
    const FEATURE_COUNT = 40;
    const MAX_ATTEMPTS = 1000;

    // initial room for the map
    const initialRoom = generateRoom(rng, width / 2, height / 2);

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

    this.startingLocation = { x: width / 2, y: height / 2 };
    this.features = features;
    this.width = width;
    this.height = height;
  }

  tileAt(x, y) {
    return this.features
      .find(feature => feature.contains({ x, y }))
      .getPoint({ x, y });
  }
}

export default Generator;
