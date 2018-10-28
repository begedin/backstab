import { pick, frac } from 'backstab/Random';

const STATES = {
  STANDING: 'standing',
  PATROLING: 'patroling',
  ALERTED: 'alerted',
  SEARCHING: 'searching',
};

const detects = (entity, player) =>
  entity.seenPoints.some(({ x, y }) => x === player.x && y === player.y);

const computePath = ({ x: x1, y: y1 }, { x: x2, y: y2 }, pathfinder) => {
  // easystar.js works asynchronously
  // this is a "hacky" way of getting a synchronous result
  let path;
  pathfinder.findPath(x1, y1, x2, y2, p => {
    path = p;
  });
  pathfinder.calculate();
  return path;
};

const maybeChangeState = (entity, gameData, pathfinder) => {
  const { player } = gameData.dungeon;

  if (detects(entity, player) && entity.state !== STATES.ALERTED) {
    entity.set('state', STATES.ALERTED);
    entity.set('isAlerted', true);
  }

  if (!entity.state || entity.state === STATES.STANDING) {
    if (frac() > 0.5) {
      const patrolTarget = pick(entity.parentFeature.innerPoints);
      const patrolPath = computePath(entity, patrolTarget, pathfinder);

      entity.set('patrolTarget', patrolTarget);
      entity.set('patrolPath', patrolPath);
      entity.set('state', STATES.PATROLING);
    }
  }

  if (entity.state === STATES.PATROLING) {
    const { patrolTarget, patrolPath } = entity;
    if (entity.x === patrolTarget.x && entity.y === patrolTarget.y) {
      entity.set('state', STATES.STANDING);
    } else {
      const currentIndex = patrolPath.findIndex(
        ({ x, y }) => x === entity.x && y === entity.y,
      );
      const next = patrolPath[currentIndex + 1];
      if (player.x === next.x && player.y === next.y) {
        entity.set('lastKnownPlayerPosition', { x: player.x, y: player.y });
        entity.set('state', STATES.ALERTED);
      }
    }
  }

  if (entity.state === STATES.ALERTED) {
    if (!detects(entity, player)) {
      entity.set('state', STATES.SEARCHING);
      entity.set('isAlerted', false);
    }
  }

  if (entity.state === STATES.SEARCHING) {
    const { lastKnownPlayerPosition: target } = entity;
    if (target.x === entity.x && target.y === entity.y) {
      entity.set('state', STATES.STANDING);
    }
  }
};

const decide = (entity, gameData, pathfinder) => {
  maybeChangeState(entity, gameData, pathfinder);

  if (entity.state === STATES.PATROLING) {
    const { patrolPath } = entity;
    const currentIndex = patrolPath.findIndex(
      ({ x, y }) => x === entity.x && y === entity.y,
    );
    const target = patrolPath[currentIndex + 1];
    return { type: 'MOVE', data: { entity, target } };
  }

  if (entity.state === STATES.ALERTED) {
    const { player } = gameData.dungeon;
    entity.set('lastKnownPlayerPosition', { x: player.x, y: player.y });
    const [, target] = computePath(entity, player, pathfinder);

    if (target.x === player.x && target.y === player.y) {
      return { type: 'MELEE_ATTACK', data: { entity, target: player } };
    }

    return { type: 'MOVE', data: { entity, target } };
  }

  if (entity.state === STATES.SEARCHING) {
    const { lastKnownPlayerPosition } = entity;
    const [, target] = computePath(entity, lastKnownPlayerPosition, pathfinder);
    const { player } = gameData.dungeon;
    if (player.x === target.x && player.y === target.y) {
      return { type: 'MELEE_ATTACK', data: { entity, target: player } };
    }
    return { type: 'MOVE', data: { entity, target } };
  }

  return { type: 'WAIT', data: { entity } };
};

export default decide;
