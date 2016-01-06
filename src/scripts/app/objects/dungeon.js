import { initialize2DArray, flatten2DArray } from 'app/helpers/array';
import Randomizer from 'app/helpers/randomizer';
import { Terrains } from 'app/enums/terrain';
import Room from 'app/objects/room';
import Tile from 'app/objects/tile';


import config from 'app/config';


class Dungeon {
  constructor (game) {
    this.game = game;
    this.mapSize = config.MAP_SIZE;
    this.width = this.mapSize;
    this.height = this.mapSize;

    this.rooms = [];
    this.rng = new Randomizer();
    
    this.map = initialize2DArray(this.mapSize, this.mapSize, 0)

    var roomCount = this.rng.integerInRange(10, 20);
    var minSize = 5;
    var maxSize = 15;

    this._placeRooms(roomCount, minSize, maxSize);
    this._joinRooms(roomCount);
    this._carveRooms(roomCount);

    this._generateTileMap();
  }

  tileAt(x, y) {
    return this.tiles[x][y];
  }

  get firstWalkableTile() {
    return flatten2DArray(this.tiles).find(function(tile) {
      return tile.isWalkable === true
    });
  }

  _placeRooms (roomCount, minSize, maxSize) {
    var roomsPlaced = 0;
    while (roomsPlaced <= roomCount) {
      var roomX = this.rng.integerInRange(1, this.mapSize - maxSize - 1);
      var roomY = this.rng.integerInRange(1, this.mapSize - maxSize - 1);
      var roomW = this.rng.integerInRange(minSize, maxSize);
      var roomH = this.rng.integerInRange(minSize, maxSize);
      
      var room = new Room(roomX, roomY, roomW, roomH);

      if (!room.colidesWithAny(this.rooms)) { 
        this.rooms.push(room);
        roomsPlaced++;
      }
    }
  }

  _joinRooms (roomCount) {
    for (var i = 0; i < roomCount; i++) {
      var roomA = this.rooms[i];
      var roomB = roomA.getClosest(this.rooms);

      this._joinTwoRooms(roomA, roomB);
    }
  }

  _joinTwoRooms (roomA, roomB) {
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

  _carveRooms (roomCount) {
    for (var i = 0; i < roomCount; i++) {
      this._carveRoom(this.rooms[i]);
      
    }
  }

  _carveRoom (room) {
    for (var x = room.x; x < room.x + room.w; x++) {
      for (var y = room.y; y < room.y + room.h; y++) {
        this.map[x][y] = 1;
      }
    }
  }

  _generateTileMap () {
    let game = this.game;

    let tiles = this.map.map(function(mapRow, i) {
      return mapRow.map(function(mapField, j) {
        let terrain = numberToTerrain(mapField);        
        return new Tile(game, terrain, i, j)
      });
    });

    this.tiles = tiles;
  }
}

function numberToTerrain(number) {
  if (number === 1) {
    return Terrains.FLOOR;
  } else {
    return Terrains.ROCK
  }
}

export default Dungeon;