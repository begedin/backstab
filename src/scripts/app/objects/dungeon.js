'use strict';

import { Terrains } from 'app/enums/terrain';
import Tile from 'app/objects/tile';
import Room from 'app/objects/room';

var HEIGHT = 60;
var WIDTH = 80;

var NUM_ROOM_TRIES = 60;

var ROOM_EXTRA_SIZE = 0;

var WINDING_PERCENT = 0;

function initialize2DArray(WIDTH, HEIGHT, defaultValue) {
  if (!defaultValue) {
    defaultValue = 0;
  }

  var matrix = [];
  for (var i = 0; i < WIDTH; i++) {
    var row = [];
    for (var j = 0; j < HEIGHT; j++) {
      row.push(defaultValue)
    }
    matrix.push(row);
  }

  return matrix;
}

function lastElementInArray(array) {
  return array[array.length - 1];
}

function removeLastElementFromArray(array) {
  array.pop(lastElementInArray(array));
}

class Dungeon extends Phaser.Group {

  constructor (game) {
    super(game);

		this.game = game;

    this.rooms = [];
    this.tiles = [];
    this.regions = initialize2DArray(WIDTH, HEIGHT, 0);

    this.currentRegion = -1;

		this.init();
		this.fill(Terrains.ROCK);
		this.addRooms();
    this.fillRemainderWithMazes();
		this.addTiles();
	}

  getTile(x, y) {
    return this.tiles[x][y];
  }

	setTile (x, y, terrainType) {
		this.tiles[x][y] = terrainType;
	}

	carveRoom (room, terrainType) {
    for (var x = room.left; x <= room.right; x++) {
    	for (var y = room.top; y <= room.bottom; y++) {
    		this.carve(x,y, terrainType);
    	}
    }
	}

  carve(x, y, terrainType) {
    if (!terrainType) {
      terrainType = Terrains.FLOOR;
      this.setTile(x, y, terrainType);
      this.regions[x][y] = this.currentRegion;
    }
  }

	init () {
		for (var x = 0; x < WIDTH; x++) {
			this.tiles.push([]);
			for (var y = 0; y < HEIGHT; y++) {
				this.tiles[x].push(null);
			}
		}
	}

	fill (terrainType) {
		for (var y = 0; y < HEIGHT; y++) {
			for (var x = 0; x < WIDTH; x++) {
				this.setTile(x, y, terrainType);
			}
		}
	}

	addRooms () {
		var rng = this.game.rnd;

		for (var i = 0; i < NUM_ROOM_TRIES; i++) {
			// * 2 + 1 makes sure rooms are odd-sized. they end up beeing between 3 and 6 tiles big
			// by default, with ROOM_EXTRA_SIZE increasing this number
			var size = rng.integerInRange(1, 3 + ROOM_EXTRA_SIZE) * 2 + 1;

			// amount to add to either width or height to make the rooms less rectangular
			var rectangularity = this.game.rnd.integerInRange(0, 1 + Math.floor(size / 2)) * 2;

			var width = size;
			var height = size;

			if (rng.pick([ 0, 1 ]) === 1) {
				width += rectangularity;
			} else {
				height += rectangularity;
			}

			var x = rng.integerInRange(0, Math.floor((WIDTH - width) / 2)) * 2 + 1;
			var y = rng.integerInRange(0, Math.floor((HEIGHT - height) / 2)) * 2 + 1;

			var room = new Room(x, y, width, height);

			var overlaps = false;
			for (var other of this.rooms) {
				if (room.distanceTo(other) <= 0) {
					overlaps = true;
					break;
				}
			}

			if (overlaps) {
				continue;
			}

      this.startRegion();
			this.rooms.push(room);
			this.carveRoom(room);
		}
	}

  fillRemainderWithMazes() {
    // Fill in all of the empty space with mazes.
    for (var y = 1; y < HEIGHT; y += 2) {
      for (var x = 1; x < WIDTH; x += 2) {
        if (this.getTile(x,y).terrain !== Terrains.ROCK) {
          this.growMaze(x,y);
        }
      }
    }
  }

  growMaze(x, y) {
    var rng = this.game.rnd;
    var arrayUtils = this.game.arrayUtils;

    var cells = [];
    var lastDir;

    this.startRegion();
    this.carve(x, y);

    cells.push({x: x, y: y});

    while (cells.isNotEmpty) {
      var cell = lastElementInArray(cells);

      // See which adjacent cells are open.
      var unmadeCells = [];

      for (var dir in ['up', 'down', 'left', 'right']) {
        if (this.canCarve(cell, dir)) unmadeCells.add(dir);
      }

      if (unmadeCells.length > 0) {
        // Based on how "windy" passages are, try to prefer carving in the
        // same direction.
        var dir;
        if (unmadeCells.contains(lastDir) && rng.integerInRange(0, 100) > WINDING_PERCENT) {
          dir = lastDir;
        } else {
          dir = arrayUtilsy.getRandomItem(unmadeCells);
        }

        var addedCells = this.carveInDirectionFromCell(cell, dir, amount);

        cells.concat(addedCells);
        lastDir = dir;
      } else {
        // No adjacent uncarved cells.
        cells.removeLast();

        // This path has ended.
        lastDir = null;
      }
    }
  }

  startRegion() {
    this.currentRegion++;
  }

	addTiles () {
		for (var x = 0; x < WIDTH; x++) {
			for (var y = 0; y < HEIGHT; y++) {
				var terrainType = this.tiles[x][y];
				this.add(new Tile(this.game, terrainType, x, y));
			}
		}
	}




}

export default Dungeon;
