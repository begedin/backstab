import { pick, frac } from '@/Random';
import Entity from '@/Entity';
import Player from '@/Player';
import { DungeonPoint } from '@/objects/dungeon/feature';
import { js as EasyStarJS } from 'easystarjs';
import { GameData } from '@/types/GameData';

export const STATES = {
  STANDING: 'standing',
  PATROLING: 'patroling',
  ALERTED: 'alerted',
  SEARCHING: 'searching',
};

const detects = (entity: Entity, player: Player): boolean =>
  entity.seenPoints
    ? entity.seenPoints.some(({ x, y }) => x === player.x && y === player.y)
    : false;

const computePath = async (
  p1: DungeonPoint,
  p2: DungeonPoint,
  pathfinder: EasyStarJS,
): Promise<DungeonPoint[]> => {
  return new Promise<DungeonPoint[]>((resolve, reject): void => {
    pathfinder.findPath(p1.x, p1.y, p2.x, p2.y, p => (p ? resolve(p) : reject(p)));
    pathfinder.calculate();
  });
};

const maybeChangeState = async (
  entity: Entity,
  gameData: GameData,
  pathfinder: EasyStarJS,
): Promise<void> => {
  const { player } = gameData;

  if (detects(entity, player) && entity.state !== STATES.ALERTED) {
    entity.state = STATES.ALERTED;
    entity.isAlerted = true;
    return;
  }

  if (!entity.state || entity.state === STATES.STANDING) {
    if (frac() < 0.5) return;
    if (!entity.parentFeature) return;

    const patrolTarget = pick<DungeonPoint>(entity.parentFeature.innerPoints);
    const patrolPath = await computePath(entity, patrolTarget, pathfinder);

    entity.patrolTarget = patrolTarget;
    entity.patrolPath = patrolPath;
    entity.state = STATES.PATROLING;

    return;
  }

  if (entity.state === STATES.PATROLING) {
    const { patrolTarget, patrolPath } = entity;

    if (!patrolTarget || !patrolPath) return;

    if (entity.x === patrolTarget.x && entity.y === patrolTarget.y) {
      entity.state = STATES.STANDING;
    } else {
      const currentIndex = patrolPath.findIndex(({ x, y }) => x === entity.x && y === entity.y);
      const next = patrolPath[currentIndex + 1];
      if (player.x === next.x && player.y === next.y) {
        entity.lastKnownPlayerPosition = { x: player.x, y: player.y };
        entity.state = STATES.ALERTED;
      }
    }

    return;
  }

  if (entity.state === STATES.ALERTED) {
    if (detects(entity, player)) return;

    entity.state = STATES.SEARCHING;
    entity.isAlerted = false;
    return;
  }

  if (entity.state === STATES.SEARCHING) {
    const { lastKnownPlayerPosition: target } = entity;
    if (!target) return;

    entity.state = STATES.STANDING;
    return;
  }
};

export type AIOutcome = {
  type: 'MOVE' | 'MELEE_ATTACK' | 'WAIT';
  data: {
    entity: Entity;
    target?: DungeonPoint;
  };
};

const decide = async (
  entity: Entity,
  gameData: GameData,
  pathfinder: EasyStarJS,
): Promise<AIOutcome | undefined> => {
  maybeChangeState(entity, gameData, pathfinder);

  if (entity.state === STATES.PATROLING) {
    const { patrolPath } = entity;
    if (!patrolPath) return;
    const currentIndex = patrolPath.findIndex(({ x, y }) => x === entity.x && y === entity.y);
    const target = patrolPath[currentIndex + 1];
    return { type: 'MOVE', data: { entity, target } };
  }

  if (entity.state === STATES.ALERTED) {
    const { player } = gameData.dungeon;
    entity.lastKnownPlayerPosition = { x: player.x, y: player.y };
    const [, target] = await computePath(entity, player, pathfinder);

    if (target.x === player.x && target.y === player.y) {
      return { type: 'MELEE_ATTACK', data: { entity, target: player } };
    }

    return { type: 'MOVE', data: { entity, target } };
  }

  if (entity.state === STATES.SEARCHING) {
    const { lastKnownPlayerPosition } = entity;
    if (!lastKnownPlayerPosition) return;
    const [, target] = await computePath(entity, lastKnownPlayerPosition, pathfinder);
    const { player } = gameData.dungeon;
    if (player.x === target.x && player.y === target.y) {
      return { type: 'MELEE_ATTACK', data: { entity, target: player } };
    }
    return { type: 'MOVE', data: { entity, target } };
  }

  return { type: 'WAIT', data: { entity } };
};

export default decide;
