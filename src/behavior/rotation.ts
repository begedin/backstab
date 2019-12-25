import * as Random from '@/Random';
import { Direction } from '@/actions/performPlayerCommand';
import Entity from '@/Entity';
import { DungeonPoint } from '@/objects/dungeon/feature';

const DIRECTIONS: Direction[] = ['UP', 'LEFT', 'DOWN', 'RIGHT'];

const randomDirection = (): Direction => Random.pick<Direction>(DIRECTIONS);

const nextClockWiseDirection = (current: Direction): Direction =>
  DIRECTIONS[(DIRECTIONS.indexOf(current) + 1) % DIRECTIONS.length];

const directionBetween = (a: Entity, b: DungeonPoint): Direction => {
  if (a.x < b.x && a.y === b.y) {
    return 'LEFT';
  }

  if (a.x > b.x && a.y === b.y) {
    return 'RIGHT';
  }

  if (a.x === b.x && a.y < b.y) {
    return 'DOWN';
  }

  return 'UP';
};

export { randomDirection, nextClockWiseDirection, directionBetween };
