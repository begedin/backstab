import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  init() {
    // Point the Phaser Asset Loader to where all your assets live.
    this.load.baseURL = './assets/';

    this.gameSetup();
  }

  preload() {
    // Load the required assets to display our splash screen, later.
    this.load.pack('boot', 'data/boot.json');
  }

  create() {
    // Immediately after loading the boot assets, go to the next game state.
    this.scene.start('preload');
  }

  // --------------------------------------------------------------------------

  // Use this method to adjust the game appearance, number of input pointers,
  // screen orientation handling etc.
  gameSetup() {
    this.input.maxPointers = 2;

    // this.scale.pageAlignHorizontally = true;
    // this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;

    // this.stage.disableVisibilityChange = true;
    // this.stage.smoothed = true;
  }
}
