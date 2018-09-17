import { Direction, Tiles } from 'backstab/enums';
import Feature from 'backstab/objects/dungeon/feature';
import Anchor from 'backstab/objects/dungeon/anchor';

const SIZES = [7, 9, 11, 13, 15, 17];

const computeBounds = (x, y, size, direction) => {
  const half = Math.floor(size / 2);
  switch (direction) {
    case Direction.NORTH:
      return {
        left: x - half,
        top: y - size + 1,
        right: x + half,
        bottom: y,
      };
    case Direction.SOUTH:
      return {
        left: x - half,
        top: y,
        right: x + half,
        bottom: y + size - 1,
      };
    case Direction.EAST:
      return {
        left: x - size + 1,
        right: x,
        top: y - half,
        bottom: y + half,
      };
    default:
      return {
        left: x,
        right: x + size - 1,
        top: y - half,
        bottom: y + half,
      };
  }
};

const computePoints = (size, { left, top }) => {
  const half = Math.floor(size / 2);
  const points = [];

  for (let i = 0; i < size; i += 1) {
    let min;
    let max;

    if (i < half) {
      min = half - i - 1;
      max = half + i + 1;
    } else if (i > half) {
      min = i - half - 1;
      max = size - i + half;
    } else if (i === half) {
      min = 0;
      max = size - 1;
    }

    for (let j = min; j <= max; j += 1) {
      const isWall =
        j === min ||
        j === max ||
        (i !== half && (j === min + 1 || j === max - 1));
      const terrain = isWall ? Tiles.DIRT_WALL : Tiles.DIRT_FLOOR;
      const x = left + j;
      const y = top + i;
      points.push({ x, y, terrain });
    }
  }

  return points;
};

const computeAnchors = ({ top, bottom, left, right }) => {
  const centerX = Math.floor((right - left) / 2) + left;
  const centerY = Math.floor((bottom - top) / 2) + top;

  return [
    new Anchor({ x: centerX, y: top }, Direction.NORTH),
    new Anchor({ x: centerX, y: bottom }, Direction.SOUTH),
    new Anchor({ x: left, y: centerY }, Direction.WEST),
    new Anchor({ x: right, y: centerY }, Direction.EAST),
  ];
};

const generate = (rng, x, y, direction) => {
  const size = rng.pick(SIZES);

  const bounds = computeBounds(x, y, size, direction);
  const points = computePoints(size, bounds);
  const anchors = computeAnchors(bounds);

  const feature = new Feature(bounds, points, anchors);
  feature.setPoint({ x, y }, Tiles.DIRT_FLOOR);
  feature.objects.push({ x, y, type: 'door' });

  return feature;
};

export default generate;
