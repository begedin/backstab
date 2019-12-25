import { Objects } from '@/enums';
import Entity from '@/Entity';
import DungeonLevel from '@/objects/DungeonLevel';
import Dungeon from '@/Dungeon';
import { ActionOutcome } from './ActionOutcome';

const canGoDownStairs = (entity: Entity, dungeonLevel: DungeonLevel): boolean => {
  const object = dungeonLevel.objectAt(entity.x, entity.y);
  return object ? object.type === Objects.STAIRS_DOWN : false;
};

const goDownStairs = (entity: Entity, dungeon: Dungeon): ActionOutcome | null => {
  if (!canGoDownStairs(entity, dungeon.currentLevel)) {
    return null;
  }
  return {
    type: 'STAIRS_DOWN',
    outcome: { subject: entity, dungeon },
  };
};

export default goDownStairs;
