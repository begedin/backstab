import computeSight from 'backstab/behavior/sight';
import Entity from 'backstab/objects/Entity';

const DEFAULT_RANGE = 4;
const MAX_TIME_BETWEEN_ROTATES = 4;

const overlaps = ({ x: px, y: py }, seenPoints) =>
  seenPoints.some(({ x, y }) => px === x && py === y);

const nextDirection = (current, all) =>
  all[(all.indexOf(current) + 1) % all.length];

const alertEnemies = ({ enemies }) => enemies.forEach(e => e.alert());

const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

class Palantir extends Entity {
  constructor(rng, feature, x, y) {
    super(
      { strength: 1, constitution: 5, dexterity: 1, perception: 1 },
      { damage: 0, accuracy: 1 },
    );
    this.healthFactor = 2;
    this.health = this.maxHealth;

    this.direction = rng.pick(DIRECTIONS);
    this.range = DEFAULT_RANGE;
    this.parentFeature = feature;

    this.seenPoints = computeSight(
      { x, y },
      this.direction,
      this.range,
      this.parentFeature,
    );

    this.timeSinceLastRotate = 0;

    this.x = x;
    this.y = y;

    this.name = 'palantir';
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.status = 'DEAD';
    }
  }

  act({ player }) {
    this.timeSinceLastRotate += 1;

    if (this.timeSinceLastRotate > MAX_TIME_BETWEEN_ROTATES) {
      this.rotate();
    }

    if (overlaps(player, this.seenPoints)) {
      alertEnemies(this.parentFeature);
      this.parentFeature.neighbors.forEach(alertEnemies);
    }
  }

  rotate() {
    const { direction, x, y, range, parentFeature } = this;
    const newDirection = nextDirection(direction, DIRECTIONS);
    this.direction = newDirection;

    this.seenPoints = computeSight(
      { x, y },
      newDirection,
      range,
      parentFeature,
    );

    this.timeSinceLastRotate = 0;
  }

  alert() {
    this.isAlerted = true;
  }
}

export default Palantir;
