import { Direction, Terrain } from 'backstab/enums';
import Corridor from 'backstab/objects/dungeon/features/corridor';

const ROOM_MAX_WIDTH = 15;
const ROOM_MAX_HEIGHT = 15;
const CORRIDOR_MAX_LENGTH = 6;

function movePoint(point, amount, direction) {
  if (direction === Direction.NORTH) {
    return { x: point.x, y: point.y - amount };
  }
  if (direction === Direction.WEST) {
    return { x: point.x - amount, y: point.y };
  }
  if (direction === Direction.SOUTH) {
    return { x: point.x, y: point.y + amount };
  }
  if (direction === Direction.EAST) {
    return { x: point.x + amount, y: point.y };
  }

  return null;
}

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

const computeOwnPoints = ({ left, right, top, bottom }, anchor) => {
  const points = [];

  for (let x = left; x <= right; x += 1) {
    for (let y = top; y <= bottom; y += 1) {
      let terrain;
      if (anchor && anchor.x === x && anchor.y === y) {
        terrain = Terrain.DOOR;
      } else if (isWall({ x, y }, { left, right, top, bottom })) {
        terrain = Terrain.DIRT_WALL;
      } else {
        terrain = Terrain.DIRT_FLOOR;
      }
      points.push({ x, y, terrain });
    }
  }

  return points;
};

const addDirection = ({ x, y, terrain, feature }, direction) => ({
  x,
  y,
  feature,
  terrain,
  direction,
});

// return points on all edges except the on from where the feature orriginates
const computeOwnAnchors = ({ left, right, top, bottom }, points, direction) => {
  const northAnchors = points
    .filter(p => p.x !== left && p.x !== right && p.y === top)
    .map(p => addDirection(p, Direction.NORTH));

  const southAnchors = points
    .filter(p => p.x !== left && p.x !== right && p.y === bottom)
    .map(p => addDirection(p, Direction.SOUTH));

  const eastAnchors = points
    .filter(p => p.y !== top && p.y !== bottom && p.x === right)
    .map(p => addDirection(p, Direction.EAST));

  const westAnchors = points
    .filter(p => p.y !== top && p.y !== bottom && p.x === left)
    .map(p => addDirection(p, Direction.WEST));

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

class Room {
  constructor(rng, anchorX, anchorY, direction) {
    this.rng = rng;

    const width = this.rng.integerInRange(4, ROOM_MAX_WIDTH);
    const height = this.rng.integerInRange(4, ROOM_MAX_HEIGHT);

    const anchor = { x: anchorX, y: anchorY };

    const directionSpecified = typeof direction === 'number';
    const start = directionSpecified ? movePoint(anchor, 1, direction) : anchor;

    const corridor = directionSpecified
      ? new Corridor(
          start.x,
          start.y,
          rng.integerInRange(3, CORRIDOR_MAX_LENGTH),
          direction,
        )
      : null;

    const { x, y } = corridor
      ? movePoint(start, corridor.length, direction)
      : start;

    const bounds = computeBounds(x, y, width, height, direction);

    const roomPoints = computeOwnPoints(bounds, corridor ? start : null);
    const points = corridor ? roomPoints.concat(corridor.points) : roomPoints;

    const roomAnchors = computeOwnAnchors(bounds, points, direction);
    const anchors = corridor
      ? roomAnchors.concat(corridor.anchors)
      : roomAnchors;

    this.corridor = corridor;
    this.points = points;

    if (directionSpecified) {
      this.createDoor({ x, y });
    }

    this.anchors = anchors;
    this.bounds = bounds;
  }

  createDoor({ x, y }) {
    const point = this.points.find(p => p.x === x && p.y === y);
    point.terrain = Terrain.DOOR;
  }
}

export default Room;
