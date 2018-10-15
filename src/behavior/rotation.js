import * as Random from 'backstab/Random';

const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

const randomDirection = () => Random.pick(DIRECTIONS);

const nextClockWiseDirection = current =>
  DIRECTIONS[(DIRECTIONS.indexOf(current) + 1) % DIRECTIONS.length];

const directionBetween = (a, b) => {
  if (a.x < b.x && a.y === b.y) {
    return 'EAST';
  }

  if (a.x > b.x && a.y === b.y) {
    return 'WEST';
  }

  if (a.x === b.x && a.y < b.y) {
    return 'SOUTH';
  }

  return 'NORTH';
};

export { randomDirection, nextClockWiseDirection, directionBetween };
