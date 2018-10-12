import { meleeAttack } from 'backstab/behavior/actions';
import { nextClockWiseDirection } from 'backstab/behavior/rotation';
import computeSight from 'backstab/behavior/sight';

const isInMeleeRange = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;

const attackIfInMeleeRange = (attacker, defender) => {
  if (isInMeleeRange(attacker, defender)) {
    return meleeAttack(attacker, defender);
  }

  return null;
};

const increaseRotationCounter = entity =>
  entity.set('timeSinceLastRotate', entity.timeSinceLastRotate + 1);

const shouldRotate = entity =>
  entity.timeSinceLastRotate >= entity.timeBetweenRotations;

const rotate = entity => {
  entity.set('direction', nextClockWiseDirection(entity.direction));
  entity.set('seenPoints', computeSight(entity));
  entity.set('timeSinceLastRotate', 0);
};

const detects = (entity, player) =>
  entity.seenPoints.some(({ x, y }) => x === player.x && y === player.y);

const alertEnemies = ({ enemies }) =>
  enemies.forEach(e => e.set('isAlerted', true));

const act = (entity, gameData) => {
  if (entity.state === 'attacker') {
    return attackIfInMeleeRange(entity, gameData.player);
  }

  if (entity.state === 'palantir') {
    increaseRotationCounter(entity);

    if (shouldRotate(entity)) {
      rotate(entity);
    }

    if (detects(entity, gameData.player)) {
      alertEnemies(entity.parentFeature);
      entity.parentFeature.neighbors.forEach(alertEnemies);
    }
  }

  return null;
};

export default act;
