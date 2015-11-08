import { Terrains } from 'app/enums/terrain';
import Room from 'app/objects/room';
import Randomizer from 'app/helpers/randomizer';
import { initialize2DArray, removeLastElementFromArray, lastElementInArray } from 'app/helpers/array';

var NUM_ROOM_TRIES = 60;
var ROOM_EXTRA_SIZE = 0;
var WINDING_PERCENT = 20;

class Dungeon {

  constructor (width, height) {
    this.rng = new Randomizer();

    this.width = width;
    this.height = height;

    this.boundX = width + 1;
    this.boundY = height + 1;

    this.rooms = [];
    this.tiles = [];
    this.regions = initialize2DArray(this.boundX, this.boundY, 0);

    this.currentRegion = -1;

		this.init();
		this.fill(Terrains.ROCK);

    this.addRooms();

    this.fillRemainderWithMazes();
	}

  getTile(x, y) {
    return this.tiles[x][y];
  }

	setTile (x, y, terrainType) {
		this.tiles[x][y] = terrainType;
	}

	carveRoom (room, terrainType) {
    for (var x = room.left; x < room.right; x++) {
    	for (var y = room.top; y < room.bottom; y++) {
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

  xModifierForDirection(direction) {
    if (direction === 'left') { return - 1; }
    if (direction === 'right') { return 1; }

    return 0;
  }

  yModifierForDirection(direction) {
    if (direction === 'up') { return - 1; }
    if (direction === 'down') { return 1; }

    return 0;
  }

  isWithinBounds(x, y) {
    return x > 0 && x < this.boundX && y > 0 && y < this.boundY;
  }

  isUncarved(x, y) {
    return this.tiles[x][y] === Terrains.ROCK;
  }

  canCarve (x, y, direction) {
    var xMod = this.xModifierForDirection(direction);
    var yMod = this.yModifierForDirection(direction);

    return this.isWithinBounds(x + xMod * 3, y + yMod * 3) && this.isUncarved(x + xMod * 2, y + yMod * 2);
  }

	init () {
		for (var x = 0; x < this.boundX; x++) {
			this.tiles.push([]);
			for (var y = 0; y < this.boundY; y++) {
				this.tiles[x].push(null);
			}
		}
	}

	fill (terrainType) {
		for (var y = 0; y < this.boundY; y++) {
			for (var x = 0; x < this.boundX; x++) {
				this.setTile(x, y, terrainType);
			}
		}
	}

	addRooms () {
		for (var i = 0; i < NUM_ROOM_TRIES; i++) {
			// * 2 + 1 makes sure rooms are odd-sized. they end up beeing between 3 and 6 tiles big
			// by default, with ROOM_EXTRA_SIZE increasing this number
			var size = this.rng.integerInRange(1, 3 + ROOM_EXTRA_SIZE) * 2 + 1;

			// amount to add to either width or height to make the rooms less rectangular
			var rectangularity = this.rng.integerInRange(0, 1 + Math.floor(size / 2)) * 2;

			var width = size;
			var height = size;

			if (this.rng.pick([ 0, 1 ]) === 1) {
				width += rectangularity;
			} else {
				height += rectangularity;
			}

			var x = this.rng.integerInRange(0, Math.floor((this.boundX - 1 - width) / 2)) * 2 + 1;
			var y = this.rng.integerInRange(0, Math.floor((this.boundY - 1 - height) / 2)) * 2 + 1;

			var room = new Room(x, y, width, height);

			var overlaps = false;
			for (var other of this.rooms) {
				if (room.distanceTo(other) <= 0) {
					overlaps = true;
					break;
				}
			}

			if (!overlaps) {
        this.startRegion();
  			this.rooms.push(room);
  			this.carveRoom(room);
      }

		}
	}

  fillRemainderWithMazes() {
    // Fill in all of the empty space with mazes.
    for (var y = 1; y < this.boundY; y += 2) {
      for (var x = 1; x < this.boundX; x += 2) {
        if (this.getTile(x,y) === Terrains.ROCK) {
          this.growMaze(x,y);
        }
      }
    }
  }

  growMaze(x, y) {
    var cells = [];
    var initialCell = { x: x, y: y };

    this.startRegion();
    this.carve(initialCell.x, initialCell.y);

    cells.push(initialCell);

    var lastDir = null;

    while (cells.length > 0) {

      var cell = lastElementInArray(cells);

      // See which adjacent cells are open.
      var unmadeCells = [];

      for (let dir of ['up', 'down', 'left', 'right']) {
        if (this.canCarve(cell.x, cell.y, dir)) {
          unmadeCells.push(dir);
        }
      }

      if (unmadeCells.length > 0) {
        // Based on how "windy" passages are, try to prefer carving in the
        // same direction.
        var dirToCarveIn = lastDir;
        if (unmadeCells.indexOf(lastDir) === -1 || this.rng.integerInRange(0, 100) < WINDING_PERCENT) {
          dirToCarveIn = this.rng.pick(unmadeCells);
        }

        var xMod = this.xModifierForDirection(dirToCarveIn);
        var yMod = this.yModifierForDirection(dirToCarveIn);

        var adjacentCell = { x: cell.x + xMod, y: cell.y + yMod};
        this.carve(adjacentCell.x, adjacentCell.y);

        var endCell = {x: cell.x + xMod * 2, y: cell.y + yMod * 2};
        this.carve(endCell.x, endCell.y);

        cells.push(endCell);

        lastDir = dirToCarveIn;
      } else {
        // No adjacent uncarved cells.
        lastDir = null;
        removeLastElementFromArray(cells);
      }
    }
  }

  startRegion() {
    this.currentRegion++;
  }
}

export default Dungeon;
