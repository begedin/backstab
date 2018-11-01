import { Terrain, Objects } from 'backstab/enums';
import * as Random from 'backstab/Random';
import generateRoom from 'backstab/objects/dungeon/generator/room';
import generateDiamondRoom from 'backstab/objects/dungeon/generator/diamond_room';
import DungeonLevel from 'backstab/objects/DungeonLevel';

const canPlaceFeature = (features, feature) =>
  !features.some(f => f.overlaps(feature));

const connectFeatures = (featureA, featureB) => {
  featureA.neighbors.push(featureB);
  featureB.neighbors.push(featureA);
};

const addObject = (feature, { x, y }, type) => {
  feature.objects.push({ x, y, type });
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
  addObject(feature, anchor, Objects.DOOR);

  connectFeatures(newFeature, feature);

  return newFeature;
};

class Generator {
  constructor(width, height, isTopLevel = false) {
    const FEATURE_COUNT = 2;
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

    const startingLocation = Random.pick(initialRoom.innerPoints);

    if (!isTopLevel) {
      addObject(initialRoom, startingLocation, Objects.STAIRS_UP);
    }

    const downStairsFeature = Random.pick(features);
    const downStairsPoint = Random.pick(downStairsFeature.innerPoints);
    addObject(downStairsFeature, downStairsPoint, Objects.STAIRS_DOWN);

    const level = new DungeonLevel(startingLocation, features, width, height);
    level.stairsDownLocation = { x: downStairsPoint.x, y: downStairsPoint.y };

    return level;
  }
}

export default Generator;
