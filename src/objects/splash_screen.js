import Phaser from 'phaser';

class SplashScreen extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);

    this.classType = Phaser.Image;

    this.create(0, 0, 'splash-screen');
    this.progressBar = this.create(82, 282, 'progress-bar');
  }
}

export default SplashScreen;
