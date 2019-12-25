import { Terrain } from '@/enums';
import Entity from '@/Entity';

export type Bounds = { left: integer; right: integer; top: integer; bottom: integer };
export type DungeonPoint = { x: integer; y: integer };
export type DungeonTile = DungeonPoint & { terrain: integer };
export type DungeonObject = DungeonPoint & { type: integer };

class Feature {
  bounds: Bounds;
  points: DungeonTile[];
  anchors: DungeonPoint[];
  neighbors: Feature[];
  enemies: Entity[];
  objects: DungeonObject[];

  constructor(bounds: Bounds, points: DungeonPoint[], anchors: DungeonPoint[]) {
    this.bounds = bounds;
    this.points = points.map(p => ({ ...p, terrain: -1 }));
    this.anchors = anchors;
    this.neighbors = [];
    this.enemies = [];
    this.objects = [];
  }

  getPoint({ x, y }: DungeonPoint): DungeonTile | undefined {
    return this.points.find(({ x: pX, y: pY }) => x === pX && y === pY);
  }

  setPoint({ x, y }: DungeonPoint, terrain: keyof typeof Terrain): void {
    const point = this.points.find(p => p.x === x && p.y === y);
    if (!point) {
      return;
    }
    point.terrain = Terrain[terrain];
  }

  getObject({ x, y }: DungeonPoint): DungeonObject | undefined {
    return this.objects.find(({ x: oX, y: oY }) => x === oX && y === oY);
  }

  get length(): integer {
    const { left, right, top, bottom } = this.bounds;
    const width = right - left;
    const height = bottom - top;
    return width > height ? width : height;
  }

  get innerPoints(): DungeonTile[] {
    return this.points.filter(p => p.terrain === Terrain.DIRT_FLOOR);
  }

  // simple rectangle overlap formula
  overlaps({ bounds: b }: Feature): boolean {
    const { bounds: a } = this;
    return a.left < b.right && a.right > b.left && a.bottom > b.top && a.top < b.bottom;
  }

  contains({ x, y }: DungeonPoint): boolean {
    return this.points.some(p => p.x === x && p.y === y);
  }
}

export default Feature;
