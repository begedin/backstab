import Room from 'entities/room';

var MAP_ROWS = 25;
var MAP_COLUMNS = 80;
var MIN_ROOM_SIZE = 4;
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
    while (this.rooms.length < count) {
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
    var width = this.game.rnd.integerInRange(MIN_ROOM_SIZE, maxWidth);

    var maxHeight = Math.min(MAP_COLUMNS - y, MAX_ROOM_SIZE);
    if (maxHeight < MIN_ROOM_SIZE) {
        return;
    }
    var height = this.game.rnd.integerInRange(MIN_ROOM_SIZE, maxHeight);

    var newRoom = new Room(this.game, x, y, width, height);
    if (!this.roomHasOverlap(newRoom)) {
      this.rooms.push(newRoom);
    }

  }

  roomHasOverlap(room) {
    for (var otherRoom of this.rooms) {
      if (room.overlaps(otherRoom)) {
        return true;
      }
    }
  }

  linkRooms() {
    console.log("TODO: Link rooms");
  }

  debugDraw() {
    var map = [];
    for (var rowNum = 0; rowNum < MAP_ROWS; rowNum++) {
      var mapRow = [];
      for (var colNum = 0; colNum < MAP_COLUMNS; colNum++) {
        mapRow.push('.');
      }
      map.push(mapRow);
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
