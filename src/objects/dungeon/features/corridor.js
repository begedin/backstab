import { Direction, Terrain } from 'backstab/enums';

const isVertical = direction =>
  direction === Direction.NORTH || direction === Direction.SOUTH;

const computeLeftEdge = (x, width, direction) => {
  if (isVertical(direction)) {
    return x - 1;
  }
  if (direction === Direction.EAST) {
    return x;
  }

  return x - width + 1;
};

const computeTopEdge = (y, height, direction) => {
  if (!isVertical(direction)) {
    return y - 1;
  }

  if (direction === Direction.SOUTH) {
    return y;
  }

  return y - height + 1;
};

const computeBounds = (x, y, length, direction) => {
  const width = isVertical(direction) ? 3 : length;
  const height = isVertical(direction) ? length : 3;
  const left = computeLeftEdge(x, width, direction);
  const top = computeTopEdge(y, height, direction);
  const right = left + width - 1;
  const bottom = top + height - 1;

  return { top, bottom, left, right };
};

const isWall = ({ x, y }, { left, right, top, bottom }, direction) =>
  isVertical(direction) ? x === left || x === right : y === top || y === bottom;

const computePoints = ({ left, right, top, bottom }, direction) => {
  const points = [];

  for (let x = left; x <= right; x += 1) {
    for (let y = top; y <= bottom; y += 1) {
      const terrain = isWall({ x, y }, { left, right, top, bottom }, direction)
        ? Terrain.DIRT_WALL
        : Terrain.CORRIDOR;
      points.push({ x, y, terrain });
    }
  }

  return points;
};

const computeAnchors = ({ left, right, top, bottom }, points, direction) =>
  isVertical(direction)
    ? points.filter(p => p.x === left || p.x === right)
    : points.filter(p => p.y === top || p.y === bottom);

class Corridor {
  constructor(x, y, length, direction) {
    const bounds = computeBounds(x, y, length, direction);
    const points = computePoints(bounds, direction);
    const anchors = computeAnchors(bounds, points, direction);

    this.points = points;
    this.anchors = anchors;
    this.length = length;
  }
}

export default Corridor;
