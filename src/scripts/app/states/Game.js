/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */
import Dungeon from 'app/objects/dungeon';

export default class Game extends Phaser.State {

  create () {
    let { centerX: x, centerY: y } = this.world;

    this.dungeon = new Dungeon(this.game);
  }

  update () {
  }

}
