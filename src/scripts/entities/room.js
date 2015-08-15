class Room {
  constructor(game, x, y, width, height) {
    this.game = game;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.halls = [];
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  overlaps(entity) {
    return this.left <= entity.right &&
      entity.left <= this.right &&
      this.top <= entity.bottom &&
      entity.top <= this.bottom;
  }
}

export default Room;
