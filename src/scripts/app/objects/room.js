'use strict';

class Room {
  constructor (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
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
    return (this.x + this.w < otherRoom.x) || (this.x > otherRoom.x + otherRoom.w) || (this.y + this.h < otherRoom.y) || (this.y > otherRoom.y + otherRoom.h):
  }
}

export default Room;
