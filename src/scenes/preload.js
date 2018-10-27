import Phaser from 'phaser';
import Dungeon from 'backstab/Dungeon';

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
      const dungeon = new Dungeon();
      dungeon.ascend();
      this.scene.start('DungeonLevel', dungeon);
    }
  }
}
