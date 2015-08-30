/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */
import Map from 'app/objects/map';

export default class Game extends Phaser.State {

  create () {
    let { centerX: x, centerY: y } = this.world;

    this.map = new Map(this.game);
  }

  update () {
  }

}
