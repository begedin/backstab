import { Objects } from 'backstab/enums';

const canGoDownStairs = (entity, dungeonLevel) => {
  const object = dungeonLevel.objectAt(entity.x, entity.y);
  return object && object.type === Objects.STAIRS_DOWN;
};

const goDownStairs = (entity, dungeon) => {
  if (!canGoDownStairs(entity, dungeon.currentLevel)) {
    return null;
  }
  return {
    type: 'STAIRS_DOWN',
    outcome: { subject: entity, dungeon },
  };
};

export default goDownStairs;
