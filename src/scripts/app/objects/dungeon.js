import { initialize2DArray, printMatrixToConsole } from 'app/helpers/array';
import Randomizer from 'app/helpers/randomizer';
import { Terrains } from 'app/enums/terrain';
import Room from 'app/objects/room';

import config from 'app/config';


class Dungeon {
  constructor () {
    this.mapSize = config.MAP_SIZE;
    this.width = this.mapSize;
    this.height = this.mapSize;

    this.rooms = [];
    this.rng = new Randomizer();
    
    this.map = initialize2DArray(this.mapSize, this.mapSize, 0)

    var roomCount = this.rng.integerInRange(10, 20);
    var minSize = 5;
    var maxSize = 15;

    this.placeRooms(roomCount, minSize, maxSize);
    this.joinRooms(roomCount);
    this.carveRooms(roomCount);

    this.generateTiles();
  }

  placeRooms (roomCount, minSize, maxSize) {
    var roomsPlaced = 0;
    while (roomsPlaced <= roomCount) {
      var roomX = this.rng.integerInRange(1, this.mapSize - maxSize - 1);
      var roomY = this.rng.integerInRange(1, this.mapSize - maxSize - 1);
      var roomW = this.rng.integerInRange(minSize, maxSize);
      var roomH = this.rng.integerInRange(minSize, maxSize);
      
      var room = new Room(roomX, roomY, roomW, roomH);

      if (!room.colidesWithAny(this.rooms)) {
        room.w--;
        room.h--;

        this.rooms.push(room);
        roomsPlaced++;
      }
    }
  }

  joinRooms (roomCount) {
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