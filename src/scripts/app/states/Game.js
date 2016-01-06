/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */

import assets from '../data/assets';

import Dungeon from 'app/objects/dungeon';
import Tile from 'app/objects/tile';
import Player from 'app/objects/player';

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
    var dungeon = new Dungeon();
    this.loadDungeon(dungeon);
    this.createPlayer();
  }

  loadDungeon (dungeon) {
    var tiles = new Phaser.Group(this.game);
    for (var x = 0; x < dungeon.width; x++) {
      for (var y = 0; y < dungeon.height; y++) {
        var terrainType = dungeon.tiles[x][y];
        tiles.add(new Tile(this.game, terrainType, x, y));
      }
    }
  }

  createPlayer() {
    var actors = new Phaser.Group(this.game);
    var player = new Player(this.game, 1, 1);
    actors.add(player);
  }

  update () {
  }
}
