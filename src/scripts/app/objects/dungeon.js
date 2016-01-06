import { initialize2DArray, printMatrixToConsole } from 'app/helpers/array';
import Randomizer from 'app/helpers/randomizer';
import { Terrains } from 'app/enums/terrain';

import config from 'app/config';


class Dungeon {
  constructor () {
    this.mapSize = config.MAP_SIZE;
    this.width = this.mapSize;
    this.height = this.mapSize;

    this.rooms = [];
    this.rng = new Randomizer();
    
    // create map of all 0s (rock)
    this.map = initialize2DArray(this.mapSize, this.mapSize, 0)

    // initialize dungeon state
    var roomCount = this.rng.integerInRange(10, 20);
    var minSize = 5;
    var maxSize = 15;

    this.placeRooms(roomCount, minSize, maxSize);
    this.squashRooms();
    this.joinRooms(roomCount);
    this.carveRooms(roomCount);

    this.generateTiles();

    //printMatrixToConsole(this.map);

    // add room borders
    /*for (var x = 0; x < this.map_size; x++) {
      for (var y = 0; y < this.map_size; y++) {
        if (this.map[x][y] == 1) {
          for (var xx = x - 1; xx <= x + 1; xx++) {
            for (var yy = y - 1; yy <= y + 1; yy++) {
              if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
            }
          }
        }
      }
    }*/
  }

  placeRooms (roomCount, minSize, maxSize) {
    var roomsPlaced = 0;
    while (roomsPlaced <= roomCount) {
      var room = {};
      room.x = this.rng.integerInRange(1, this.mapSize - maxSize - 1);
      room.y = this.rng.integerInRange(1, this.mapSize - maxSize - 1);
      room.w = this.rng.integerInRange(minSize, maxSize);
      room.h = this.rng.integerInRange(minSize, maxSize);

      if (!this.roomColidesWithOtherRooms(room)) {
        // TODO: Why do we decrement here?
        room.w--;
        room.h--;

        this.rooms.push(room);
        roomsPlaced++;
      }
    }
  }

  squashRooms () {
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < this.rooms.length; j++) {
        var room = this.rooms[j];

        var done = false;
        
        while (!done) {
          var oldPosition = {
            x: room.x,
            y: room.y
          };
          
          if (room.x > 1) {
            room.x--;
          }
          
          if (room.y > 1) {
            room.y--;
          }

          if ((room.x == 1) && (room.y == 1)) {
            done = true;
          }

          if (this.roomColidesWithOtherRooms(room, j)) {
            room.x = oldPosition.x;
            room.y = oldPosition.y;
            done = true;
          }
        }
      }
    }
  }

  joinRooms (roomCount) {
    // join each room with their closest room
    for (var i = 0; i < roomCount; i++) {
      var roomA = this.rooms[i];
      var roomB = this.findClosestRoom(roomA);

      this.joinTwoRooms(roomA, roomB);
    }
  }

  joinTwoRooms (roomA, roomB) {
    var pointA = {
      x: this.rng.integerInRange(roomA.x, roomA.x + roomA.w),
      y: this.rng.integerInRange(roomA.y, roomA.y + roomA.h)
    };

    var pointB = {
      x: this.rng.integerInRange(roomB.x, roomB.x + roomB.w),
      y: this.rng.integerInRange(roomB.y, roomB.y + roomB.h)
    };

    while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
      if (pointB.x != pointA.x) {
        if (pointB.x > pointA.x) { 
          pointB.x--;
        } else {
          pointB.x++;
        }
      } else if (pointB.y != pointA.y) {
        if (pointB.y > pointA.y) {
          pointB.y--;
        } else {
          pointB.y++;
        }
      }

      this.map[pointB.x][pointB.y] = 1;
    }
  }

  carveRooms (roomCount) {
    // carve out each room
    for (var i = 0; i < roomCount; i++) {
      var room = this.rooms[i];
      for (var x = room.x; x < room.x + room.w; x++) {
        for (var y = room.y; y < room.y + room.h; y++) {
          this.map[x][y] = 1;
        }
      }
    }
  }

  generateTiles () {
    var tiles = [];
    this.map.forEach(function(mapRow) {
      var tileRow = [];
      mapRow.forEach(function(mapIndex) {
        var tile;

        if (mapIndex === 1) {
          tileRow.push(Terrains.FLOOR);
        } else {
          tileRow.push(Terrains.ROCK);
        }
      });
      tiles.push(tileRow);
    });

    this.tiles = tiles;
  }

  roomColidesWithOtherRooms (room, roomIndexToIgnore) {
    for (var i = 0; i < this.rooms.length; i++) {
      if (i !== roomIndexToIgnore)  {
        var check = this.rooms[i];
        if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) {
          return true;
        }
      }
    }
    return false;
  }

  findClosestRoom (room) {
    var mid = {
      x: room.x + (room.w / 2),
      y: room.y + (room.h / 2)
    };
    var closest = null;
    var closestDistance = 1000;
    for (var i = 0; i < this.rooms.length; i++) {
      var check = this.rooms[i];
      if (check !== room) {
        var check_mid = {
          x: check.x + (check.w / 2),
          y: check.y + (check.h / 2)
        };
        var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = check;
        }
      }
    }
    return closest;
  }
}

export default Dungeon;