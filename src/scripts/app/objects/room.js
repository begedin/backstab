'use strict';

function pointDistance(x1, y1, x2, y2) {
  return Math.sqrt( (x2-x1) * (x2-x1) + (y2-y1) * (y2-y1));
}

class Room {
  constructor (left, top, width, height) {
    this.setBoundaries(left, top, width, height);
  }

  setBoundaries (left, top, width, height) {
    this.left = left;
    this.top = top;
    this.right = left + width - 1;
    this.bottom = top + height - 1;
  }

  distanceTo(otherRoom) {
    var left = otherRoom.right < this.left;
    var right = this.right < otherRoom.left;
    var bottom = otherRoom.bottom < this.top;
    var top = this.bottom < otherRoom.top;

    if (top && left) {
      return pointDistance(this.left, this.bottom, otherRoom.right, otherRoom.top);
    } else if (left && bottom) {
      return pointDistance(this.left, this.top, otherRoom.right, otherRoom.bottom);
    } else if (bottom && right) {
      return pointDistance(this.right, this.top, otherRoom.left, otherRoom.bottom);
    } else if (right && top) {
      return pointDistance(this.right, this.bottom, otherRoom.left, otherRoom.top);
    } else if (left) {
      return this.left - otherRoom.right;
    } else if (right) {
      return otherRoom.left - this.right;
    } else if (bottom) {
      return this.top - otherRoom.bottom;
    } else if (top) {
      return otherRoom.top - this.bottom;
    } else {
      return 0;
    }
  }
}

export default Room;
