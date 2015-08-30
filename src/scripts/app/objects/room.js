import { Terrains } from 'app/enums/terrain';
import Tile from 'app/objects/tile';

class Room extends Phaser.Group {
  constructor (game, left, top, width, height) {
    super(game);

    this.setBoundaries(left, top, width, height);
    this.addTiles();
  }

  setBoundaries (left, top, width, height) {
    this.left = left;
    this.top = top;
    this.right = left + width - 1;
    this.bottom = top + height - 1;
  }

  addTiles () {
    for (var y = this.top; y <= this.bottom; y++) {
      for (var x = this.left; x <= this.right; x++) {
        this.add(new Tile(this.game, Terrains.ROCK_FLOOR, x, y));
      }
    }
  }
}

export default Room;
