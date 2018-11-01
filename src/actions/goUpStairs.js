import { Objects } from 'backstab/enums';

const canGoUpStairs = (entity, dungeon) => {
  const { currentLevelIndex, currentLevel } = dungeon;

  if (currentLevelIndex === 0) {
    return false;
  }

  const object = currentLevel.objectAt(entity.x, entity.y);
  return object && object.type === Objects.STAIRS_UP;
};

const goUpStairs = (entity, dungeon) => {
  if (!canGoUpStairs(entity, dungeon)) {
    return null;
  }
  return {
    type: 'STAIRS_UP',
    outcome: { subject: entity, dungeon },
  };
};

export default goUpStairs;
