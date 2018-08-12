import Phaser from 'phaser';
import SplashScreen from 'backstab/objects/splash_screen';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  init() {
    this.assetsReady = false;
  }

  preload() {
    this.load.pack('game', 'data/game.json');
  }

  create() {
    this.assetsReady = true;
  }

  update() {
    // Wait until all sound effects have been decoded into memory.
    if (this.assetsReady) {
      this.scene.start('game');
    }
  }
}
