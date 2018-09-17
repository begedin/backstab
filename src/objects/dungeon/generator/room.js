import { Direction, Tiles } from 'backstab/enums';
import Feature from 'backstab/objects/dungeon/feature';
import Anchor from 'backstab/objects/dungeon/anchor';

const ROOM_MAX_WIDTH = 15;
const ROOM_MAX_HEIGHT = 15;

const computeLeftEdge = (x, width, direction) => {
  if (direction === Direction.EAST) {
    return x;
  }

  if (direction === Direction.WEST) {
    return x - width + 1;
  }

  return x - Math.floor(width / 2);
};

const computeTopEdge = (y, height, direction) => {
  if (direction === Direction.SOUTH) {
    return y;
  }

  if (direction === Direction.NORTH) {
    return y - height + 1;
  }

  return y - Math.floor(height / 2);
};

const computeBounds = (x, y, width, height, direction) => {
  const left = computeLeftEdge(x, width, direction);
  const top = computeTopEdge(y, height, direction);
  const right = left + width - 1;
  const bottom = top + height - 1;

  return { top, bottom, left, right };
};

const isWall = ({ x, y }, { left, right, top, bottom }) =>
  x === left || x === right || y === top || y === bottom;

const computePoints = ({ left, right, top, bottom }) => {
  const points = [];

  for (let x = left; x <= right; x += 1) {
    for (let y = top; y <= bottom; y += 1) {
      let terrain;
      if (isWall({ x, y }, { left, right, top, bottom })) {
        terrain = Tiles.DIRT_WALL;
      } else {
        terrain = Tiles.DIRT_FLOOR;
      }
      points.push({ x, y, terrain });
    }
  }

  return points;
};

// return points on all edges except the on from where the feature orriginates
const computeAnchors = ({ left, right, top, bottom }, points, direction) => {
  const northAnchors = points
    .filter(p => p.x !== left && p.x !== right && p.y === top)
    .map(p => new Anchor(p, Direction.NORTH));

  const southAnchors = points
    .filter(p => p.x !== left && p.x !== right && p.y === bottom)
    .map(p => new Anchor(p, Direction.SOUTH));

  const eastAnchors = points
    .filter(p => p.y !== top && p.y !== bottom && p.x === right)
    .map(p => new Anchor(p, Direction.EAST));

  const westAnchors = points
    .filter(p => p.y !== top && p.y !== bottom && p.x === left)
    .map(p => new Anchor(p, Direction.WEST));

  if (direction === Direction.NORTH) {
    return northAnchors.concat(eastAnchors).concat(westAnchors);
  }

  if (direction === Direction.SOUTH) {
    return southAnchors.concat(eastAnchors).concat(westAnchors);
  }

  if (direction === Direction.EAST) {
    return eastAnchors.concat(northAnchors).concat(southAnchors);
  }

  return westAnchors.concat(northAnchors).concat(southAnchors);
};

const generate = (rng, x, y, direction) => {
  const width = rng.integerInRange(5, ROOM_MAX_WIDTH);
  const height = rng.integerInRange(5, ROOM_MAX_HEIGHT);

  const bounds = computeBounds(x, y, width, height, direction);
  const points = computePoints(bounds);
  const anchors = computeAnchors(bounds, points, direction);

  const feature = new Feature(bounds, points, anchors);

  const directionSpecified = typeof direction === 'number';
  if (directionSpecified) {
    feature.setPoint({ x, y }, Tiles.DIRT_FLOOR);
    feature.objects.push({ x, y, type: 'door' });
  }

  return feature;
};

export default generate;
