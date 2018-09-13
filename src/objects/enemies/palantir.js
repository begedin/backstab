import computeSight from 'backstab/objects/behavior/sight';

const DEFAULT_RANGE = 4;
const MAX_TIME_BETWEEN_ROTATES = 4;

const overlaps = ({ x: px, y: py }, lookedAtPoints) =>
  lookedAtPoints.some(({ x, y }) => px === x && py === y);

const nextDirection = ({ x, y }, possibleDirections) => {
  const matched = possibleDirections.find(d => d.x === x && d.y === y);
  const index =
    (possibleDirections.indexOf(matched) + 1) % possibleDirections.length;
  return possibleDirections[index];
};

const alertNeighbouringEnemies = (player, enemies, feature) =>
  feature.neighbors.forEach(n => n.enemies.forEach(e => e.alert(player)));

const DIRECTIONS = ['EAST', 'WEST', 'NORTH', 'SOUTH'];

class Palantir {
  constructor(scene, rng, feature, x, y) {
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
    this.health = 1;

    this.x = x;
    this.y = y;

    this.name = 'palantir';
  }

  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.status = 'DEAD';
    }
  }

  update(player, enemies) {
    this.timeSinceLastRotate += 1;
    if (this.timeSinceLastRotate > MAX_TIME_BETWEEN_ROTATES) {
      this.rotate();
    }

    if (overlaps(player, this.overlays.children.entries)) {
      alertNeighbouringEnemies(player, enemies, this.parentFeature);
    }
  }

  rotate() {
    const { direction, possibleDirections, x, y, range, parentFeature } = this;
    const newDirection = nextDirection(direction, possibleDirections);
    this.direction = newDirection;

    this.lookedAtPoints = computeSight(
      { x, y },
      direction,
      possibleDirections,
      range,
      parentFeature,
    );

    this.timeSinceLastRotate = 0;
  }
}

export default Palantir;
