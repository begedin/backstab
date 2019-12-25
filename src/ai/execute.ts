import { directionBetween } from '@/behavior/rotation';
import computeSight from '@/behavior/sight';
import move from '@/actions/move';
import meleeAttack from '@/actions/meleeAttack';
import wait from '@/actions/wait';
import Entity from '@/Entity';
import { AIOutcome } from './decide';
import { ActionOutcome } from '@/actions/ActionOutcome';
import { Direction } from '@/actions/performPlayerCommand';

const rotate = (entity: Entity, direction: Direction): void => {
  entity.direction = direction;
  entity.seenPoints = computeSight(entity);
  entity.timeSinceLastRotation = 0;
};

const execute = ({ type, data }: AIOutcome): ActionOutcome | undefined => {
  if (type === 'MOVE') {
    const { entity, target } = data;
    if (!target) return;
    const nextDirection = directionBetween(entity, target);
    rotate(entity, nextDirection);
    return move(entity, target);
  }

  if (type === 'MELEE_ATTACK') {
    const { entity, target } = data;
    if (!target) return;
    const nextDirection = directionBetween(entity, target);
    rotate(entity, nextDirection);
    return meleeAttack(entity, target as Entity);
  }

  if (type === 'WAIT') {
    const { entity } = data;
    return wait(entity);
  }
};

export default execute;
