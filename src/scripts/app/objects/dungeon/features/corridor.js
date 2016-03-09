import { Direction } from 'app/enums';

const CORRIDOR_MAX_LENGTH = 12;

class Corridor {
  constructor(dungeon, x, y, direction) {
    this.dungeon = dungeon;
    this.rng = dungeon.rng;
    this.x = x;
    this.y = y;
    this.length = this.rng.integerInRange(3, CORRIDOR_MAX_LENGTH);
    this.direction = direction;
  }

  get width() {
    if (this.direction === Direction.NORTH || this.direction === Direction.SOUTH) {
      return 3;
    } else if (this.direction === Direction.EAST || this.direction === Direction.WEST) {
      return this.length;
    }
  }

  get height() {
    if (this.direction === Direction.NORTH || this.direction === Direction.SOUTH) {
      return this.length;
    } else if (this.direction === Direction.EAST || this.direction === Direction.WEST) {
      return 3;
    }
  }

  get left() {
    if (this._isVertical) {
      return this.x - 1;
    } else if (this.direction === Direction.EAST) {
      return this.x;
    } else if (this.direction === Direction.WEST) {
      return this.x - this.width + 1;
    }
  }

  get right() {
    return this.left + this.width - 1;
  }

  get top() {
    if (this._isHorizontal) {
      return this.y - 1;
    } else if (this.direction === Direction.SOUTH) {
      return this.y;
    } else if (this.direction === Direction.NORTH) {
      return this.y - this.height + 1;
    }
  }

  get bottom() {
    return this.top + this.height - 1;
  }

  get bounds() {
    return {
      top: this.top,
      bottom: this.bottom,
      left: this.left,
      right: this.right
    };
  }

  get points() {
    let points = [];
    for (let i = this.left; i <= this.right; i++) {
      for (let j = this.top; j <= this.bottom; j++) {
        points.push({ x: i, y: j });
      }
    }

    return points;
  }

  get _isHorizontal() {
    return this.direction === Direction.WEST || this.direction === Direction.EAST;
  }

  get _isVertical () {
    return this.direction === Direction.NORTH || this.direction === Direction.SOUTH;
  }

  isWall(point) {
    if (this._isHorizontal) {
      return point.y === this.top || point.y === this.bottom;
    } else if (this._isVertical) {
      return point.x === this.left || point.x === this.right;
    }
  }
}

export default Corridor;
