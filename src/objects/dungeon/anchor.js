import { Direction } from 'backstab/enums';

const moveInDirection = (x, y, direction, amount) => {
  if (direction === Direction.NORTH) {
    return { x, y: y - amount };
  }

  if (direction === Direction.SOUTH) {
    return { x, y: y + amount };
  }

  if (direction === Direction.EAST) {
    return { x: x + amount, y };
  }
  return { x: x - amount, y };
};

class Anchor {
  constructor({ x, y, terrain }, direction) {
    this.x = x;
    this.y = y;
    this.terrain = terrain;
    this.direction = direction;
    this.attachment = moveInDirection(x, y, direction, 1);
  }
}

export default Anchor;
