import { Terrain } from 'backstab/enums';
import * as Random from 'backstab/Random';
import generateRoom from 'backstab/objects/dungeon/generator/room';
import generateDiamondRoom from 'backstab/objects/dungeon/generator/diamond_room';
import Dungeon from 'backstab/objects/dungeon';

const canPlaceFeature = (features, feature) =>
  !features.some(f => f.overlaps(feature));

const connectFeatures = (featureA, featureB) => {
  featureA.neighbors.push(featureB);
  featureB.neighbors.push(featureA);
};

const addDoor = (feature, { x, y }) => {
  feature.objects.push({ x, y, type: Terrain.DOOR });
};

const tryGenerateFeature = existingFeatures => {
  const feature = Random.pick(existingFeatures);
  const anchor = Random.pick(feature.anchors);

  if (!anchor) {
    return null;
  }

  const {
    attachment: { x, y },
    direction,
  } = anchor;

  const newFeature =
    Random.pick([1, 2]) === 1
      ? generateRoom(x, y, direction)
      : generateDiamondRoom(x, y, direction);

  if (!canPlaceFeature(existingFeatures, newFeature)) {
    return false;
  }

  feature.setPoint(anchor, Terrain.DIRT_FLOOR);
  addDoor(feature, anchor);

  connectFeatures(newFeature, feature);

  return newFeature;
};

class Generator {
  constructor(width, height) {
    const FEATURE_COUNT = 1;
    const MAX_ATTEMPTS = 1000;

    // initial room for the map
    const initialRoom = generateRoom(width / 2, height / 2);

    const features = [initialRoom];

    let attempts = 0;

    // remaining features for the map
    while (features.length < FEATURE_COUNT && attempts <= MAX_ATTEMPTS) {
      const feature = tryGenerateFeature(features);
      if (feature) {
        features.push(feature);
      }
      attempts += 1;
    }

    return new Dungeon(
      { x: width / 2, y: height / 2 },
      features,
      width,
      height,
    );
  }
}

export default Generator;
