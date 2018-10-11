import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  init() {
    this.assetsReady = false;
  }

  preload() {
    this.load.image('tileset', 'assets/tileset.png');
    this.load.atlas(
      'characters',
      'assets/characters.png',
      'assets/characters.json',
    );
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
