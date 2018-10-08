import computeSight from 'backstab/behavior/sight';
import Entity from 'backstab/objects/Entity';
import {
  randomDirection,
  nextClockWiseDirection,
} from 'backstab/behavior/rotation';

const DEFAULT_RANGE = 4;
const MAX_TIME_BETWEEN_ROTATES = 4;

const overlaps = ({ x: px, y: py }, seenPoints) =>
  seenPoints.some(({ x, y }) => px === x && py === y);

const alertEnemies = ({ enemies }) => enemies.forEach(e => e.alert());

class Palantir extends Entity {
  constructor(feature, x, y, id) {
    super(
      { strength: 1, constitution: 5, dexterity: 1, perception: 1 },
      { damage: 0, accuracy: 1 },
      'palantir',
      id,
    );
    this.healthFactor = 2;
    this.health = this.maxHealth;

    this.direction = randomDirection();
    this.range = DEFAULT_RANGE;
    this.parentFeature = feature;
    this.x = x;
    this.y = y;

    this.seenPoints = computeSight(this);
    this.timeSinceLastRotate = 0;
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

    return null;
  }

  rotate() {
    this.direction = nextClockWiseDirection(this.direction);
    this.seenPoints = computeSight(this);
    this.timeSinceLastRotate = 0;
  }

  alert() {
    this.isAlerted = true;
  }
}

export default Palantir;
