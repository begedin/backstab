import Phaser from 'phaser';

const updateHealth = (
  { playerHealthBar, playerHealthText },
  { health, maxHealth },
) => {
  // update bar
  playerHealthBar.fillStyle(0xff0000);
  const innerBarMaxWidth = 74;
  const innerBarWidth = (health / maxHealth) * innerBarMaxWidth;
  const innerBarMaxHeight = 14;
  playerHealthBar.fillRect(12, 12, 12 + innerBarWidth, 12 + innerBarMaxHeight);

  // update text
  playerHealthText.setText(`${health}/${maxHealth}`);
  playerHealthText.setOrigin(0.5);
};

export default class GameUI extends Phaser.Scene {
  constructor() {
    super('GameUI');
    this.score = 0;
  }

  create() {
    const game = this.scene.get('Game');
    // create empty health bar
    this.playerHealthBar = this.add.graphics();
    this.playerHealthBar.lineStyle(3, 0xffffff);
    this.playerHealthBar.strokeRect(10, 10, 90, 30);
    this.playerHealthBar.fillStyle(0x000000);
    this.playerHealthBar.fillRect(10, 10, 90, 30);
    // create health text
    this.playerHealthText = this.add.text(60, 25);

    updateHealth(this, game.gameData.player);

    game.events.on(
      'healthChange',
      (current, max) => updateHealth(this, current, max),
      this,
    );
  }
}
