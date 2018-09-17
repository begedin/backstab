import { Direction, Tiles } from 'backstab/enums';
import Feature from 'backstab/objects/dungeon/feature';
import Anchor from 'backstab/objects/dungeon/anchor';

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
    terrain: Tiles.DIRT_WALL,
  }));

  const centerCorridor = [...Array(length)].map((el, i) => ({
    x: left + 1,
    y: i + top,
    terrain: Tiles.CORRIDOR,
  }));

  const rightWall = [...Array(length)].map((el, i) => ({
    x: left + 2,
    y: i + top,
    terrain: Tiles.DIRT_WALL,
  }));

  return leftWall.concat(centerCorridor).concat(rightWall);
};

const computeHorizontalPoints = ({ left, right, top }) => {
  const length = right - left + 1;
  const topWall = [...Array(length)].map((el, i) => ({
    x: i + left,
    y: top,
    terrain: Tiles.DIRT_WALL,
  }));
  const centerCorridor = [...Array(length)].map((el, i) => ({
    x: i + left,
    y: top + 1,
    terrain: Tiles.CORRIDOR,
  }));
  const bottomWall = [...Array(length)].map((el, i) => ({
    x: i + left,
    y: top + 2,
    terrain: Tiles.DIRT_WALL,
  }));

  return topWall.concat(centerCorridor).concat(bottomWall);
};

const computeVerticalAnchors = ({ left, right, top, bottom }, points) => {
  const leftAnchors = points
    .filter(p => p.y !== top && p.y !== bottom && p.x === left)
    .map(p => new Anchor(p, Direction.WEST));
  const rightAnchors = points
    .filter(p => p.y !== top && p.y !== bottom && p.x === right)
    .map(p => new Anchor(p, Direction.EAST));

  return leftAnchors.concat(rightAnchors);
};

const computeHorizontalAnchors = ({ left, right, top, bottom }, points) => {
  const topAnchors = points
    .filter(p => p.x !== left && p.x !== right && p.y === top)
    .map(p => new Anchor(p, Direction.NORTH));

  const bottomAnchors = points
    .filter(p => p.x !== left && p.x !== right && p.y === bottom)
    .map(p => new Anchor(p, Direction.SOUTH));

  return topAnchors.concat(bottomAnchors);
};

const generate = (rng, x, y, direction) => {
  const length = rng.integerInRange(3, 12);
  const bounds = computeBounds(x, y, length, direction);

  const vertical = isVertical(direction);

  const points = vertical
    ? computeVerticalPoints(bounds)
    : computeHorizontalPoints(bounds);

  const anchors = vertical
    ? computeVerticalAnchors(bounds, points)
    : computeHorizontalAnchors(bounds, points);

  return new Feature(bounds, points, anchors);
};

export default generate;
