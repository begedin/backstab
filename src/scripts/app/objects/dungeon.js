import Terrains from 'app/enums/terrain';
import Room from 'app/objects/rooom';

HEIGHT: 40;
WIDTH: 80;

class Dungeon {
	constructor(game) {
		this.game = game;
		this.init();
		this.fill(Terrains.ROCK);	
		this.addRooms();
		this.addTiles();
	}

	var numRoomTries;

	// increase this to make bigger rooms
	var roomExtraSize = 0;

	var _tiles = [];
	var _rooms = [];

	setTile (x, y, terrainType) {
		_tiles[x][y] = terrainType;
	}

	function _carve(room, terrainType) {
		if (!terrainType) {
			terrainType = Terrains.FLOOR;
		}
    for (var x = room.left; x <= room.right; x++) {
    	for (var y = room.top; y <= room.bottom; y++) {
    		this.setTile(x, y, terrainType);
    	}
    }
	}

	init() {
		for (var x = 0; x < WIDTH; x++) {
			_tiles.push([]);
			for (var y = 0; y < HEIGHT; y++) {
				_tiles[x].push(null);
			}
		}
	}

	fill (terrainType) {
		for (var y = 0; y < HEIGHT; y++) {
			for (var x = 0; x < WIDTH; x++) {
				setTile(x, y, terrainType);
			}
		}
	}

	addRooms () {
		var rng = this.game.rnd;

		for (var i = 0; i < numRoomTries; i++) {
			// * 2 + 1 makes sure rooms are odd-sized. they end up beeing between 3 and 6 tiles big
			// by default, with roomExtraSize increasing this number
			var size = rng.integerInRange(1, 3 + roomExtraSize) * 2 + 1;

			// amount to add to either width or height to make the rooms less rectangular
			var rectangularity = this.game.rnd.integerInRange(0, 1 + Math.floor(size / 2)) * 2;

			var width = size;
			var height = size;

			if (rng.pick([0, 1]) === 1) {
				width += rectangularity;
			} else {
				height += rectangularity;
			}

			var x = rng.integerInRange(0, Math.floor((WIDTH - width) / 2) * 2 + 1);
			var y = rng.integerInRange(0, Math.floor((HEIGHT - height) / 2) * 2 + 1);

			var room = new Room(x, y, width, height);

			var overlaps = false;
			for (var other of _rooms) {
				if (room.distanceTo(other) <= 0) {
					overlaps = true;
					break;
				}
			}

			if (overlaps) {
				continue;
			}

			_rooms.push(room);
			_carve(room);
		}
	}

	addTiles () {
		for (var x = 0; x < WIDTH; x++) {
			for (var y = 0; y < HEIGHT; y++) {
				var terrainType = _tiles[x][y];
				this.add(new Tile(this.game, terrainType, x, y));
			}
		}
	}

}