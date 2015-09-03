import { Terrains } from 'app/enums/terrain';
import Tile from 'app/objects/tile';
import Room from 'app/objects/room';

var HEIGHT = 60;
var WIDTH = 80;

var NUM_ROOM_TRIES = 60;

var ROOM_EXTRA_SIZE = 0;

class Dungeon extends Phaser.Group {

  constructor (game) {
    super(game);

		this.game = game;

    this.rooms = [];
    this.tiles = [];

		this.init();
		this.fill(Terrains.ROCK);
		this.addRooms();
		this.addTiles();
	}

	setTile (x, y, terrainType) {
		this.tiles[x][y] = terrainType;
	}

	carve (room, terrainType) {
		if (!terrainType) {
			terrainType = Terrains.FLOOR;
		}
    for (var x = room.left; x <= room.right; x++) {
    	for (var y = room.top; y <= room.bottom; y++) {
    		this.setTile(x, y, terrainType);
    	}
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

			var x = rng.integerInRange(0, Math.floor((WIDTH - width) / 2) * 2 + 1);
			var y = rng.integerInRange(0, Math.floor((HEIGHT - height) / 2) * 2 + 1);

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

			this.rooms.push(room);
			this.carve(room);
		}
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
