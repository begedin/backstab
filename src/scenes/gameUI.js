import Phaser from 'phaser';
import {
  renderInitialTurnOrder,
  updateTurnOrder,
} from 'backstab/renderers/turnOrder';

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

const findContainerSlot = (scene, actorContainer) =>
  scene.turnOrderContainer.list.find(
    c => c.getData('id') === actorContainer.getData('id'),
  );

const highlightContainerSlot = (scene, actorContainer) => {
  const slot = findContainerSlot(scene, actorContainer);
  return slot && slot.getByName('highlight').setVisible(true);
};

const unhighlightContainerSlot = (scene, actorContainer) => {
  const slot = findContainerSlot(scene, actorContainer);
  return slot && slot.getByName('highlight').setVisible(false);
};

const setupHoverSpriteHighlightsSlot = (
  scene,
  { playerContainer, enemyContainers },
) => {
  const playerSprite = playerContainer.getByName('sprite').setInteractive();
  playerSprite.on('pointerover', () =>
    highlightContainerSlot(scene, playerContainer),
  );
  playerSprite.on('pointerout', () =>
    unhighlightContainerSlot(scene, playerContainer),
  );
  enemyContainers.forEach(enemyContainer => {
    const enemySprite = enemyContainer.getByName('sprite').setInteractive();
    enemySprite.on('pointerover', () =>
      highlightContainerSlot(scene, enemyContainer),
    );
    enemySprite.on('pointerout', () =>
      unhighlightContainerSlot(scene, enemyContainer),
    );
  });
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

    setupHoverSpriteHighlightsSlot(this, game.renderData, game.turnQueue);

    updateHealth(this, game.gameData.player);
    this.turnOrderContainer = renderInitialTurnOrder(this, game.turnQueue);
    updateTurnOrder(this.turnOrderContainer, game.turnQueue);

    game.events.on('healthChange', player => updateHealth(this, player), this);

    game.events.on(
      'turnChange',
      () => {
        updateTurnOrder(this.turnOrderContainer, game.turnQueue);
      },
      this,
    );

    game.events.on('actorHoverIn', actor =>
      highlightContainerSlot(this, actor),
    );
    game.events.on('actorHoverOut', actor =>
      unhighlightContainerSlot(this, actor),
    );
  }
}
