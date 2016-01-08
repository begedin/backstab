/*
 * The `app` module
 * ============================================================================
 *
 * The module providing the main routine of the game application launch.
 */

// Import all declared states as an object.
import * as states from './app/states';
import config from './app/config';


export default function () {
  let game = new Phaser.Game(config.GAME_WIDTH, config.GAME_HEIGHT, Phaser.AUTO);

  // Dynamically add all required game states.
  Object.keys(states)
    .map((key) => [ key, states[key] ])
    .forEach((args) => game.state.add(... args));

  game.state.start('Boot');

  return game;
}
