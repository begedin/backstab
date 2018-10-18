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

const decide = (entity, gameData, pathfinder) => {
  const { dungeon, player } = gameData;

  if (entity.status === 'DEAD') {
    return { type: 'DEAD' };
  }

  if (detects(entity, player) && entity.state !== 'alerted') {
    return { type: 'ENEMY_DETECTED', data: { entity, player } };
  }

  if (!entity.state || entity.state === 'standing') {
    if (frac() > 0.5) {
      // easystar.js works asynchronously
      // this is a "hacky" way of getting a synchronous result
      const patrolTarget = pick(entity.parentFeature.innerPoints);
      let patrolPath;
      pathfinder.findPath(
        entity.x,
        entity.y,
        patrolTarget.x,
        patrolTarget.y,
        path => {
          patrolPath = path;
        },
      );
      pathfinder.calculate();

      return {
        type: 'START_MOVING',
        data: { entity, patrolTarget, patrolPath },
      };
    }

    if (shouldRotate(entity)) {
      return { type: 'ROTATE_CLOCKWISE', data: { entity } };
    }
    return { type: 'INCREASE_ROTATION_COUNTER', data: { entity } };
  }

  if (entity.state === 'moving') {
    const currentIndex = entity.patrolPath.findIndex(
      ({ x, y }) => x === entity.x && y === entity.y,
    );

    if (currentIndex === entity.patrolPath.length - 1) {
      return { type: 'STOP_MOVING', data: { entity } };
    }

    const type = 'MOVE_ALONG_PATROL_PATH';
    return { type, data: { dungeon, entity, currentIndex, player } };
  }

  if (entity.state === 'alerted') {
    if (!detects(entity, player)) {
      return { type: 'START_SEARCHING', data: { entity } };
    }

    return {
      type: 'MOVE_TOWARDS_PLAYER',
      data: { entity, player, dungeon, pathfinder },
    };
  }

  if (entity.state === 'searching') {
    const {
      lastKnownPlayerPosition: target,
      timeSinceLastSeenPlayer = 0,
    } = entity;
    if (target.x === entity.x && target.y === entity.y) {
      if (timeSinceLastSeenPlayer >= 3) {
        return { type: 'STOP_SEARCHING', data: { entity } };
      }

      return { type: 'INCREASE_SEARCH_COUNTER', data: { entity } };
    }

    return {
      type: 'MOVE_TOWARDS_PLAYER_POSITION',
      data: { entity, dungeon, pathfinder, player },
    };
  }

  return null;
};

const actOut = ({ type, data }) => {
  if (type === 'ENEMY_DETECTED') {
    const { entity } = data;
    alertEnemies(entity.parentFeature);
    entity.parentFeature.neighbors.forEach(alertEnemies);
    entity.set('state', 'alerted');
    return wait(entity);
  }

  if (type === 'START_MOVING') {
    const { entity, patrolPath, patrolTarget } = data;
    entity.set('patrolPath', patrolPath);
    entity.set('patrolTarget', patrolTarget);
    entity.set('state', 'moving');
    return wait(entity);
  }

  if (type === 'STOP_MOVING') {
    const { entity } = data;
    entity.set('state', 'standing');
    return wait(entity);
  }

  if (type === 'MOVE_ALONG_PATROL_PATH') {
    const { currentIndex, dungeon, entity, player } = data;
    const next = entity.patrolPath[currentIndex + 1];
    const nextDirection = directionBetween(entity, next);
    rotate(entity, nextDirection);
    return enterPosition(entity, next, dungeon, [player]);
  }

  if (type === 'ROTATE_CLOCKWISE') {
    const { entity } = data;
    rotateClockwise(entity);
    return wait(entity);
  }

  if (type === 'INCREASE_ROTATION_COUNTER') {
    const { entity } = data;
    increaseRotationCounter(entity);
    return wait(entity);
  }

  if (type === 'START_SEARCHING') {
    const { entity } = data;
    entity.set('state', 'searching');
    return wait(entity);
  }

  if (type === 'INCREASE_SEARCH_COUNTER') {
    const { entity } = data;
    const { timeSinceLastSeenPlayer = 0 } = entity;
    entity.set('timeSinceLastSeenPlayer', timeSinceLastSeenPlayer + 1);
    return wait(entity);
  }

  if (type === 'MOVE_TOWARDS_PLAYER_POSITION') {
    const { entity, dungeon, player, pathfinder } = data;
    return moveTowardsPlayerPosition(entity, { dungeon, player }, pathfinder);
  }

  if (type === 'STOP_SEARCHING') {
    const { entity } = data;
    entity.set('state', 'standing');
    entity.set('isAlerted', false);
    return wait(entity);
  }

  if (type === 'MOVE_TOWARDS_PLAYER') {
    const { dungeon, entity, player, pathfinder } = data;
    entity.set('lastKnownPlayerPosition', { x: player.x, y: player.y });
    return moveTowardsPlayerPosition(entity, { dungeon, player }, pathfinder);
  }

  const { entity } = data;
  return wait(entity);
};

const act = (entity, gameData, pathfinder) => {
  const action = decide(entity, gameData, pathfinder);
  return actOut(action);
};

export default act;
