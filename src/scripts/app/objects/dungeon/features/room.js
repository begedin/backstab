import { Direction } from 'app/enums';
import Corridor from 'app/objects/dungeon/features/corridor';

const ROOM_MAX_WIDTH = 8;
const ROOM_MAX_HEIGHT = 6;

function isAValidDirection(value) {
  return [Direction.NORTH, Direction.SOUTH, Direction.WEST, Direction.EAST].indexOf(value) > -1;
}

function addInDirection(point, amount, direction) {
  if (direction === Direction.NORTH) {
    return { x: point.x, y: point.y - amount };
  } else if (direction === Direction.WEST) {
    return { x: point.x - amount, y: point.y };
  } else if (direction === Direction.SOUTH) {
    return { x: point.x, y: point.y + amount };
  } else if (direction === Direction.EAST) {
    return { x: point.x + amount, y: point.y };
  }
}

class Room {
  constructor(dungeon, x, y, direction) {
    this.dungeon = dungeon;
    this.rng = dungeon.rng;

    if (isAValidDirection(direction)) {
      this.corridor = new Corridor(dungeon, x, y, direction);
      this.roomDoorPosition = addInDirection({ x: x, y: y }, this.corridor.length, direction);
      this.x = this.roomDoorPosition.x;
      this.y = this.roomDoorPosition.y;
      this.direction = direction;
    } else {
      this.x = x;
      this.y = y;
    }

    this.width = this.rng.integerInRange(4, ROOM_MAX_WIDTH);
    this.height = this.rng.integerInRange(4, ROOM_MAX_HEIGHT);
  }

  // TODO: Check these coordinates for potential bugs

  get left() {
    if (this.direction === Direction.NORTH || this.direction === Direction.SOUTH || !isAValidDirection(this.direction)) {
      return Math.floor(this.x - (this.width / 2));
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
    if (this.direction === Direction.EAST || this.direction === Direction.WEST || !isAValidDirection(this.direction)) {
      return Math.floor(this.y - (this.height / 2));
    } else if (this.direction === Direction.NORTH) {
      return this.y - this.height + 1;
    } else if (this.direction === Direction.SOUTH) {
      return this.y;
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

  get centerX() {
    return Math.floor(this.left + (this.width / 2));
  }

  get centerY() {
    return this.top + this.height / 2;
  }

  get center() {
    return { x: this.centerX, y: this.centerY };
  }

  isWall(point) {
    let isOwnPoint = this._isOwnPoint(point);
    if (isOwnPoint) {
      return this._isOwnWall(point);
    } else {
      return this._isCorridorWall(point);
    }
  }

  _isOwnPoint(point) {
    return this._ownPoints.some((p) => p.x === point.x && p.y === point.y);
  }

  _isOwnWall(point) {
    return this._isOwnPoint(point) && (point.x === this.left || point.x === this.right || point.y === this.top || point.y === this.bottom);
  }

  _isCorridorWall(point) {
    return this.corridor && this.corridor.isWall(point);
  }

  get _ownPoints () {
    let points = [];
    for (let i = this.left; i <= this.right; i++) {
      for (let j = this.top; j <= this.bottom; j++) {
        points.push({ x: i, y: j });
      }
    }

    return points;
  }

  get points() {
    return this._ownPoints.concat(this.corridor ? this.corridor.points : []);
  }
}

export default Room;
