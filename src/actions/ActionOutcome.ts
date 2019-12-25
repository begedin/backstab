import Entity from '@/Entity';
import Dungeon from '@/Dungeon';
import { DungeonPoint } from '@/objects/dungeon/feature';

export type ActionOutcome = {
  type: 'MELEE_ATTACK' | 'BUMP' | 'MOVE' | 'WAIT' | 'STAIRS_UP' | 'STAIRS_DOWN';
  outcome: {
    subject: Entity;
    target?: Entity | DungeonPoint;
    value?: number | 'MISS';
    dungeon?: Dungeon;
  };
};
