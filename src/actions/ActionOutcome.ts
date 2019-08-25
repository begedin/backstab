import Entity from '@/Entity';
import { Location } from '@/actions/Location';

export type ActionOutcome = {
  type: 'MELEE_ATTACK' | 'BUMP' | 'MOVE';
  outcome: { subject: Entity; target: Entity | Location; value?: number | 'MISS' };
};
