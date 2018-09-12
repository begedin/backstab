const DEFAULT_RANGE = 4;
const MAX_TIME_BETWEEN_ROTATES = 4;

const pointDiff = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => [x1 - x2, y1 - y2];

const leftQuarter = ({ x, y }, points) =>
  points.filter(p => p.x < x && Math.abs(x - p.x) >= Math.abs(y - p.y));

const rightQuarter = ({ x, y }, points) =>
  points.filter(p => p.x > x && Math.abs(x - p.x) >= Math.abs(y - p.y));

const topQuarter = ({ x, y }, points) =>
  points.filter(p => p.y < y && Math.abs(y - p.y) >= Math.abs(x - p.x));

const bottomQuarter = ({ x, y }, points) =>
  points.filter(p => p.y > y && Math.abs(y - p.y) >= Math.abs(x - p.x));

const computeSight = (
  { x, y },
  direction,
  possibleDirections,
  visionRange,
  feature,
) => {
  const points = [];
  for (let i = x - visionRange; i <= x + visionRange; i += 1) {
    for (let j = y - visionRange; j <= y + visionRange; j += 1) {
      // squares immediately surrounding the location of the palantir are a blind spot
      if (i < x - 1 || i > x + 1 || j < y - 1 || j > y + 1) {
        points.push({ x: i, y: j });
      }
    }
  }
  const diff = pointDiff({ x, y }, direction).join();

  let quarter;
  if (diff === '-1,0') {
    quarter = leftQuarter({ x, y }, points);
  } else if (diff === '0,-1') {
    quarter = topQuarter({ x, y }, points);
  } else if (diff === '1,0') {
    quarter = rightQuarter({ x, y }, points);
  } else {
    quarter = bottomQuarter({ x, y }, points);
  }

  return quarter.filter(p => feature.contains(p));
};

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

class Palantir {
  constructor(scene, rng, feature, x, y) {
    // TODO: Move to function
    const surroundingCardinalPoints = [
      { x: x - 1, y },
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
    ];

    this.possibleDirections = surroundingCardinalPoints.filter(p =>
      feature.getPoint(p),
    );

    const direction = rng.pick(this.possibleDirections);
    this.direction = direction;
    this.range = DEFAULT_RANGE;
    this.parentFeature = feature;

    this.lookedAtPoints = computeSight(
      { x, y },
      this.direction,
      this.possibleDirections,
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
