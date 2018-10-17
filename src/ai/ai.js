import {
  directionBetween,
  nextClockWiseDirection,
} from 'backstab/behavior/rotation';
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

const rotate = (entity, direction) => {
  entity.set('direction', direction);
  entity.set('seenPoints', computeSight(entity));
  entity.set('timeSinceLastRotation', 0);
};

const rotateClockwise = entity =>
  rotate(entity, nextClockWiseDirection(entity.direction));

const detects = (entity, player) =>
  entity.seenPoints.some(({ x, y }) => x === player.x && y === player.y);

const alertEnemies = ({ enemies }) =>
  enemies.forEach(e => e.set('isAlerted', true));

const moveTowardsPlayerPosition = (entity, { dungeon, player }, pathfinder) => {
  const { lastKnownPlayerPosition: target } = entity;

  let next;
  pathfinder.findPath(entity.x, entity.y, target.x, target.y, path => {
    [, next] = path;
  });
  pathfinder.calculate();

  const nextDirection = directionBetween(entity, next);
  rotate(entity, nextDirection);
  return enterPosition(entity, next, dungeon, [player]);
};

const act = (entity, gameData, pathfinder) => {
  const { dungeon, player } = gameData;

  if (entity.status === 'DEAD') {
    return null;
  }

  if (detects(entity, player) && entity.state !== 'alerted') {
    alertEnemies(entity.parentFeature);
    entity.parentFeature.neighbors.forEach(alertEnemies);
    entity.set('state', 'alerted');
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
      rotateClockwise(entity);
    } else {
      increaseRotationCounter(entity);
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
    const nextDirection = directionBetween(entity, next);
    rotate(entity, nextDirection);
    return enterPosition(entity, next, dungeon, [player]);
  }

  if (entity.state === 'alerted') {
    if (!detects(entity, player)) {
      entity.set('state', 'searching');
      return null;
    }

    entity.set('lastKnownPlayerPosition', { x: player.x, y: player.y });
    return moveTowardsPlayerPosition(entity, { dungeon, player }, pathfinder);
  }

  if (entity.state === 'searching') {
    if (detects(entity, player)) {
      entity.set('state', 'alerted');
      return null;
    }

    const {
      lastKnownPlayerPosition: target,
      timeSinceLastSeenPlayer = 0,
    } = entity;
    if (target.x === entity.x && target.y === entity.y) {
      if (timeSinceLastSeenPlayer >= 3) {
        entity.set('state', 'standing');
        return null;
      }

      entity.set('timeSinceLastSeenPlayer', timeSinceLastSeenPlayer + 1);
      // TODO: Pick random direction to search in
      return null;
    }

    return moveTowardsPlayerPosition(entity, { dungeon, player }, pathfinder);
  }

  return wait(entity);
};

export default act;
