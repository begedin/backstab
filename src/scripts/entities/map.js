import Room from 'entities/room';

var MAP_ROWS = 25;
var MAP_COLUMNS = 80;
var MIN_ROOM_SIZE = 3;
var MAX_ROOM_SIZE = 8;

var ROOM_COUNT = 10;

class Map {
  constructor(game) {
    this.game = game;

    this.rooms = [];
    this.halls = [];

    this.generate();
    this.debugDraw();
  }

  get unlinkedRooms() {
    return this.rooms.filter(function(room) {
        return room.halls.length === 0;
    });
  }

  generate() {
    console.log("Generating map");
    this.addRooms(ROOM_COUNT);
    this.linkRooms();
  }

  addRooms(count) {
    while (this.unlinkedRooms.length < count) {
        this.tryPlaceARoom();
    }
  }

  tryPlaceARoom() {
    var x = this.game.rnd.integerInRange(0, MAP_ROWS - MIN_ROOM_SIZE);
    var y = this.game.rnd.integerInRange(0, MAP_COLUMNS - MIN_ROOM_SIZE);

    var maxWidth = Math.min(MAP_ROWS - x, MAX_ROOM_SIZE);
    if (maxWidth < MIN_ROOM_SIZE) {
        return;
    }
    var width = this.game.rnd.integerInRange(3, maxWidth);

    var maxHeight = Math.min(MAP_COLUMNS - y, MAX_ROOM_SIZE);
    if (maxHeight < MIN_ROOM_SIZE) {
        return;
    }
    var height = this.game.rnd.integerInRange(3, maxHeight);

    console.log("TODO: Check if room overlaps");

    this.rooms.push(new Room(this.game, x, y, width, height));
  }

  linkRooms() {
    console.log("TODO: Link rooms");
  }

  debugDraw() {
    var map = [];
    for (var row = 0; row < MAP_ROWS; row++) {
      var map_row = [];
      for (var column = 0; column < MAP_COLUMNS; column++) {
        map_row.push('.');
      }
      map.push(map_row);
    }

    for (var room of this.rooms) {
      for (var i = room.left; i < room.right; i++) {
        for (var j = room.top; j < room.bottom; j++) {
          map[i][j] = '#';
        }
      }
    }


    for (var row of map) {
      console.log(row.join(''));
    }
  }
}

export default Map;
