import * as Random from 'backstab/Random';

const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

const randomDirection = () => Random.pick(DIRECTIONS);

const nextClockWiseDirection = current =>
  DIRECTIONS[(DIRECTIONS.indexOf(current) + 1) % DIRECTIONS.length];

export { randomDirection, nextClockWiseDirection };
