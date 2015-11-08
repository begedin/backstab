/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */

import assets from '../data/assets';

import Dungeon from 'app/objects/dungeon';
import Tile from 'app/objects/tile';

export default class Game extends Phaser.State {

  init () {
    // Point the Phaser Asset Loader to where all your assets live.
    this.load.baseURL = './assets/';
    this.stage.backgroundColor = '#fffff';

  }

  preload () {
    this.load.pack('game', null, assets);
  }

  create () {
    var dungeon = new Dungeon(19, 19);
    this.loadDungeon(dungeon);
  }

  loadDungeon (dungeon) {
    var tiles = new Phaser.Group(this.game);
    for (var x = 1; x <= dungeon.width; x++) {
      for (var y = 1; y <= dungeon.height; y++) {
        var terrainType = dungeon.tiles[x][y];
        tiles.add(new Tile(this.game, terrainType, x, y));
      }
    }
  }

  update () {
  }
}
