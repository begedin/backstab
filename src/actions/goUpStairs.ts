import { Objects } from '@/enums';
import Entity from '@/Entity';
import Dungeon from '@/Dungeon';
import { ActionOutcome } from './ActionOutcome';

const canGoUpStairs = (entity: Entity, dungeon: Dungeon): boolean => {
  const { currentLevelIndex, currentLevel } = dungeon;

  if (currentLevelIndex === 0) {
    return false;
  }

  const object = currentLevel.objectAt(entity.x, entity.y);
  return object ? object.type === Objects.STAIRS_UP : false;
};

const goUpStairs = (entity: Entity, dungeon: Dungeon): ActionOutcome | null => {
  if (!canGoUpStairs(entity, dungeon)) {
    return null;
  }
  return {
    type: 'STAIRS_UP',
    outcome: { subject: entity, dungeon },
  };
};

export default goUpStairs;
