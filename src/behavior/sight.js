import bresenhamLine from 'backstab/helpers/bresenham';
import { Tiles } from 'backstab/enums';

const getFarthestPoints = ({ x, y }, direction, visionRange) => {
  switch (direction) {
    case 'NORTH':
      return [...Array(visionRange * 2 + 1)].map((el, i) => ({
        x: x - visionRange + i,
        y: y - visionRange,
      }));
    case 'SOUTH':
      return [...Array(visionRange * 2 + 1)].map((el, i) => ({
        x: x - visionRange + i,
        y: y + visionRange,
      }));
    case 'EAST':
      return [...Array(visionRange * 2 + 1)].map((el, i) => ({
        x: x + visionRange,
        y: y - visionRange + i,
      }));
    case 'WEST':
      return [...Array(visionRange * 2 + 1)].map((el, i) => ({
        x: x - visionRange,
        y: y - visionRange + i,
      }));
    default:
      return [];
  }
};

const computeSight = ({ x, y, direction, range, parentFeature }) => {
  const farthestPoints = getFarthestPoints({ x, y }, direction, range);
  const bresenhamLines = farthestPoints.map(p => bresenhamLine({ x, y }, p));

  const sightPoints = [];

  bresenhamLines.forEach(points => {
    points.forEach(point => {
      const tile = parentFeature.getPoint({ x: point.x, y: point.y });
      if (tile && tile.terrain === Tiles.DIRT_FLOOR) {
        sightPoints.push({ x: point.x, y: point.y });
      }
    });
  });

  return sightPoints;
};

export default computeSight;
