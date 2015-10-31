/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */

'use strict';

import assets from '../data/assets';

import Dungeon from 'app/objects/dungeon';

export default class Game extends Phaser.State {

  init () {
    // Point the Phaser Asset Loader to where all your assets live.
    this.load.baseURL = './assets/';
  }

  preload () {
    this.load.pack('game', null, assets);
  }

  create () {
    this.dungeon = new Dungeon(this.game);
  }

  update () {
  }

}
