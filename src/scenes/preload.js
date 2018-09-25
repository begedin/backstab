import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  init() {
    this.assetsReady = false;
  }

  preload() {
    this.load.pack('city', 'data/city.json');
    this.load.pack('game', 'data/game.json');
    this.load.image('tiles', 'assets/tileset.png');
  }

  create() {
    this.assetsReady = true;
  }

  update() {
    // Wait until all sound effects have been decoded into memory.
    if (this.assetsReady) {
      this.scene.start('Game');
    }
  }
}
