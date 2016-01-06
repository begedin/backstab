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
      var check = rooms[i];
      if (check !== this) {
        var checkCenter = check.center;
        var distance = Math.min(Math.abs(this.center.x - checkCenter.x) - (this.w / 2) - (check.w / 2), Math.abs(this.center.y - checkCenter.y) - (this.h / 2) - (check.h / 2));
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = check;
        }
      }
    }
    return closest;
  }
}

export default Room;
