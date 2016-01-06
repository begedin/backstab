'use strict';

class Room {
  constructor (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
  }

  get center () {
    return {
      x: this.x + (this.w / 2),
      y: this.y + (this.h / 2)
    }
  }

  colidesWithAny (rooms, roomIndexToIgnore) {
    for (var i = 0; i < rooms.length; i++) {
      var otherRoom = rooms[i];
      
      if (!(otherRoom === this) && !this.collidesWith(otherRoom)) {
        return true;
      }
    }
    
    return false;
  }

  collidesWith (otherRoom) {
    return (this.x + this.w < otherRoom.x) || (this.x > otherRoom.x + otherRoom.w) || (this.y + this.h < otherRoom.y) || (this.y > otherRoom.y + otherRoom.h);
  }

  getClosest (rooms) {
    var closest = null;
    var closestDistance = 1000;
    for (var i = 0; i < rooms.length; i++) {
      var otherRoom = rooms[i];
      if (otherRoom !== this) {
        var distance = this.distanceTo(otherRoom);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = otherRoom;
        }
      }
    }
    return closest;
  }

  distanceTo (otherRoom) {
    return Math.min(this.horizontalDistanceTo(otherRoom), this.verticalDistanceTo(otherRoom));
  }

  horizontalDistanceTo (otherRoom) {
    return Math.abs(this.center.x - otherRoom.center.x) - (this.w / 2) - (otherRoom.w / 2)
  }

  verticalDistanceTo (otherRoom) {
    return Math.abs(this.center.y - otherRoom.center.y) - (this.h / 2) - (otherRoom.h / 2)
  }
}

export default Room;
