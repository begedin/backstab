import { directionBetween } from 'backstab/behavior/rotation';
import computeSight from 'backstab/behavior/sight';
import move from 'backstab/actions/move';
import meleeAttack from 'backstab/actions/meleeAttack';
import wait from 'backstab/actions/wait';

const rotate = (entity, direction) => {
  entity.direction = direction;
  entity.seenPoints = computeSight(entity);
  entity.timeSinceLastRotation = 0;
};

const execute = ({ type, data }) => {
  if (type === 'MOVE') {
    const { entity, target } = data;
    const nextDirection = directionBetween(entity, target);
    rotate(entity, nextDirection);
    return move(entity, target);
  }

  if (type === 'MELEE_ATTACK') {
    const { entity, target } = data;
    const nextDirection = directionBetween(entity, target);
    rotate(entity, nextDirection);
    return meleeAttack(entity, target);
  }

  if (type === 'WAIT') {
    const { entity } = data;
    return wait(entity);
  }

  return null;
};

export default execute;
