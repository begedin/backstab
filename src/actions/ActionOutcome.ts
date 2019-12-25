import Entity from '@/Entity';
import { Location } from '@/actions/Location';
import Dungeon from '@/Dungeon';

export type ActionOutcome = {
  type: 'MELEE_ATTACK' | 'BUMP' | 'MOVE' | 'WAIT' | 'STAIRS_UP' | 'STAIRS_DOWN';
  outcome: {
    subject: Entity;
    target?: Entity | Location;
    value?: number | 'MISS';
    dungeon?: Dungeon;
  };
};
