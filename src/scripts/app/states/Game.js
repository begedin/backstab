/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */

import assets from '../data/assets';
import Dungeon from 'app/objects/dungeon';
import Player from 'app/objects/player';

import config from 'app/config'

export default class Game extends Phaser.State {

  init() {
    // Point the Phaser Asset Loader to where all your assets live.
    this.load.baseURL = './assets/';
    this.stage.backgroundColor = '#fffff';
  }

  preload() {
    this.load.pack('game', null, assets);
  }

  create() {
    this.game.world.setBounds(0, 0, config.WORLD_BOUND_X, config.WORLD_BOUND_Y)
    var dungeon = new Dungeon(this.game);
    this.loadDungeon(dungeon);
    var player = this.createPlayer(dungeon);
    this.game.camera.follow(player);

    this.setup

    var context = this;
    this.game.input.mouse.mouseWheelCallback = function(mouseEvent) {
      context.handleMouseWheel(event)
    }
  }

  loadDungeon(dungeon) {
    var tiles = new Phaser.Group(this.game);
    for (var x = 0; x < dungeon.width; x++) {
      for (var y = 0; y < dungeon.height; y++) {
        var tile = dungeon.tiles[x][y];
        tiles.add(tile);
      }
    }
  }

  createPlayer(dungeon) {
    var actors = new Phaser.Group(this.game);
    var tile = dungeon.firstWalkableTile;
    var player = new Player(this.game, dungeon, tile.gridX, tile.gridY);
    actors.add(player);
    return player;
  }

  update() {
    this.handlePlusMinus();
  }

  handleMouseWheel() {
    var delta = this.game.input.mouse.wheelDelta;
    var amount = delta * 0.2;
    this.game.camera.scale.add(amount, amount);
  }

  handlePlusMinus() {
    if (this.game.input.keyboard.isDown(Phaser.KeyCode.PLUS) || this.game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_ADD)) {
      this.game.camera.scale.add(0.02, 0.02);
    } else if (this.game.input.keyboard.isDown(Phaser.KeyCode.MINUS) || this.game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_SUBTRACT)) {
      this.game.camera.scale.subtract(0.02, 0.02);
    }
  }
}
