import { Terrain } from 'backstab/enums';

class Feature {
  constructor(bounds, points, anchors) {
    this.bounds = bounds;
    this.points = points;
    this.anchors = anchors;
    this.neighbors = [];
    this.enemies = [];
  }

  getPoint({ x, y }) {
    return this.points.find(({ x: pX, y: pY }) => x === pX && y === pY);
  }

  setPoint({ x, y }, terrain) {
    const point = this.points.find(p => p.x === x && p.y === y);
    point.terrain = terrain;
  }

  get length() {
    const { left, right, top, bottom } = this.bounds;
    const width = right - left;
    const height = bottom - top;
    return width > height ? width : height;
  }

  get innerPoints() {
    return this.points.filter(p => p.terrain === Terrain.DIRT_FLOOR);
  }

  // simple rectangle overlap formula
  overlaps({ bounds: b }) {
    const { bounds: a } = this;
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.bottom > b.top &&
      a.top < b.bottom
    );
  }

  connectTo(feature) {
    this.neighbors.push(feature);
  }

  contains({ x, y }) {
    return this.points.some(p => p.x === x && p.y === y);
  }
}

export default Feature;
