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
    this.load.image('tileset', 'assets/tileset.png');
    this.load.spritesheet('characters', 'assets/characters.png', {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 1,
    });
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
