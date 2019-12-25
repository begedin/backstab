import { Objects } from '@/enums';
import * as Random from '@/Random';
import generateRoom from '@/objects/dungeon/generator/room';
import generateDiamondRoom from '@/objects/dungeon/generator/diamond_room';
import DungeonLevel from '@/objects/DungeonLevel';
import Feature, { DungeonPoint } from './feature';

const canPlaceFeature = (features: Feature[], feature: Feature): boolean =>
  !features.some(f => f.overlaps(feature));

const connectFeatures = (featureA: Feature, featureB: Feature): void => {
  featureA.neighbors.push(featureB);
  featureB.neighbors.push(featureA);
};

const addObject = (feature: Feature, { x, y }: DungeonPoint, type: integer): void => {
  feature.objects.push({ x, y, type });
};

const tryGenerateFeature = (existingFeatures: Feature[]): Feature | null => {
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
    return null;
  }

  feature.setPoint(anchor, 'DIRT_FLOOR');
  addObject(feature, anchor, Objects.DOOR);

  connectFeatures(newFeature, feature);

  return newFeature;
};

class Generator {
  static createLevel(width: integer, height: integer, isTopLevel = false): DungeonLevel {
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

    const startingLocation = Random.pick<DungeonPoint>(initialRoom.innerPoints);

    if (!isTopLevel) {
      addObject(initialRoom, startingLocation, Objects.STAIRS_UP);
    }

    const downStairsFeature = Random.pick<Feature>(features);
    const downStairsPoint = Random.pick<DungeonPoint>(downStairsFeature.innerPoints);
    addObject(downStairsFeature, downStairsPoint, Objects.STAIRS_DOWN);

    const level = new DungeonLevel(startingLocation, downStairsPoint, features, width, height);

    return level;
  }
}

export default Generator;
