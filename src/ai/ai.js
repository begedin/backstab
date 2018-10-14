import { nextClockWiseDirection } from 'backstab/behavior/rotation';
import computeSight from 'backstab/behavior/sight';
import { pick, frac } from 'backstab/Random';
import { enterPosition, wait } from 'backstab/behavior/actions';
// import { enterPosition, wait, meleeAttack } from 'backstab/behavior/actions';
// const isInMeleeRange = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
//   Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
//
// const attackIfInMeleeRange = (attacker, defender) => {
//   if (isInMeleeRange(attacker, defender)) {
//     return meleeAttack(attacker, defender);
//   }
//
//   return null;
// };

const increaseRotationCounter = entity =>
  entity.set('timeSinceLastRotation', entity.timeSinceLastRotation + 1);

const shouldRotate = entity =>
  entity.timeSinceLastRotation >= entity.timeBetweenRotations;

const rotate = entity => {
  entity.set('direction', nextClockWiseDirection(entity.direction));
  entity.set('seenPoints', computeSight(entity));
  entity.set('timeSinceLastRotation', 0);
};

const detects = (entity, player) =>
  entity.seenPoints.some(({ x, y }) => x === player.x && y === player.y);

const alertEnemies = ({ enemies }) =>
  enemies.forEach(e => e.set('isAlerted', true));

const act = (entity, gameData, pathfinder) => {
  const { dungeon, player } = gameData;
  if (entity.status === 'DEAD') {
    return null;
  }

  if (!entity.state || entity.state === 'standing') {
    if (frac() > 0.5) {
      // easystar.js works asynchronously
      // this is a "hacky" way of getting a synchronous result
      const target = pick(entity.parentFeature.innerPoints);
      entity.set('patrolTarget', target);
      pathfinder.findPath(entity.x, entity.y, target.x, target.y, path => {
        entity.set('patrolPath', path);
      });
      pathfinder.calculate();
      entity.set('state', 'moving');
    }

    if (shouldRotate(entity)) {
      rotate(entity);
    } else {
      increaseRotationCounter(entity);
    }

    if (detects(entity, player)) {
      alertEnemies(entity.parentFeature);
      entity.parentFeature.neighbors.forEach(alertEnemies);
    }

    return wait(entity);
  }

  if (entity.state === 'moving') {
    const currentIndex = entity.patrolPath.findIndex(
      ({ x, y }) => x === entity.x && y === entity.y,
    );

    if (currentIndex === entity.patrolPath.length - 1) {
      entity.set('state', 'standing');
      return wait(entity);
    }

    const next = entity.patrolPath[currentIndex + 1];
    return enterPosition(entity, next, dungeon, [player]);
  }

  return wait(entity);
};

export default act;
