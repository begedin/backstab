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

import config from 'app/config'

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
    this.game.world.setBounds(0, 0, config.WORLD_BOUND_X, config.WORLD_BOUND_Y)
    var dungeon = new Dungeon();
    this.loadDungeon(dungeon);
    var player = this.createPlayer();
    this.game.camera.follow(player);
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
    return player;
  }
}
