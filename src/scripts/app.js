/*
 * The `app` module
 * ============================================================================
 *
 * The module providing the main routine of the game application launch.
 */

'use strict';

// Import all declared states as an object.
import * as states from './app/states';


export default function () {
  let game = new Phaser.Game(800, 600, Phaser.AUTO);

  // Dynamically add all required game states.
  Object.keys(states)
    .map((key) => [ key, states[key] ])
    .forEach((args) => game.state.add(... args));

  game.state.start('Boot');

  return game;
}
