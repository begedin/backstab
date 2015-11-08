/*
 * The `assets` module
 * ============================================================================
 *
 * Use this module to declare static Phaser Asset Packs, that would be loaded
 * using the `Loader#pack` API.
 *
 * Regarding how the game assets should be declared using this file, refer to
 * the sample `assetPack.json` included in the Phaser package, under
 * `bower_components/phaser/resources/` directory, for a more complete
 * reference.
 *
 */

import { Terrains } from 'app/enums/terrain';

var game = [];

for (var key in Terrains) {
  var terrain = Terrains[key];
  game.push({
    key: terrain.graphic,
    type: 'image',
    url: terrain.graphic + '_debug.png'
  });
}

export default {

  // - Boot Assets ------------------------------------------------------------
  boot: [
    {
      key: 'splash-screen',
      type: 'image',
      url: 'splash-screen.png'
    },

    {
      key: 'progress-bar',
      type: 'image',
      url: 'progress-bar.png'
    }
  ],

  // - Game assets ------------------------------------------------------------
  game: game,

  // - Music and Sound effects ------------------------------------------------
  audio: [
    // // Example
    // {
    //   key: 'pow',
    //   type: 'audio',
    //   urls: [ 'pow.ogg', 'pow.m4a' ]
    // }
  ]

};
