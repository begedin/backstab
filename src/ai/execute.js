import { directionBetween } from 'backstab/behavior/rotation';
import computeSight from 'backstab/behavior/sight';
import { move, meleeAttack, wait } from 'backstab/behavior/actions';

const rotate = (entity, direction) => {
  entity.set('direction', direction);
  entity.set('seenPoints', computeSight(entity));
  entity.set('timeSinceLastRotation', 0);
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
