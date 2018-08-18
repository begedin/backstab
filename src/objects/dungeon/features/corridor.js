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

const computeVerticalPoints = ({ left, top, bottom }) => {
  const length = bottom - top + 1;

  const leftWall = [...Array(length)].map((el, i) => ({
    x: left,
    y: i + top,
    terrain: Terrain.DIRT_WALL,
  }));

  const centerCorridor = [...Array(length)].map((el, i) => ({
    x: left + 1,
    y: i + top,
    terrain: Terrain.CORRIDOR,
  }));

  const rightWall = [...Array(length)].map((el, i) => ({
    x: left + 2,
    y: i + top,
    terrain: Terrain.DIRT_WALL,
  }));

  return leftWall.concat(centerCorridor).concat(rightWall);
};

const computeHorizontalPoints = ({ left, right, top }) => {
  const length = right - left + 1;
  const topWall = [...Array(length)].map((el, i) => ({
    x: i + left,
    y: top,
    terrain: Terrain.DIRT_WALL,
  }));
  const centerCorridor = [...Array(length)].map((el, i) => ({
    x: i + left,
    y: top + 1,
    terrain: Terrain.CORRIDOR,
  }));
  const bottomWall = [...Array(length)].map((el, i) => ({
    x: i + left,
    y: top + 2,
    terrain: Terrain.DIRT_WALL,
  }));

  return topWall.concat(centerCorridor).concat(bottomWall);
};

const computeAnchors = ({ left, right, top, bottom }, points, direction) =>
  isVertical(direction)
    ? points.filter(p => p.x === left || p.x === right)
    : points.filter(p => p.y === top || p.y === bottom);

class Corridor {
  constructor(x, y, length, direction) {
    const bounds = computeBounds(x, y, length, direction);

    const points = isVertical(direction)
      ? computeVerticalPoints(bounds, direction)
      : computeHorizontalPoints(bounds, direction);
    const anchors = computeAnchors(bounds, points, direction);

    this.points = points;
    this.anchors = anchors;
    this.length = length;
  }
}

export default Corridor;
