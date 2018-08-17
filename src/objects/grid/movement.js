import globals from 'backstab/globals';

const { BASE_SPEED } = globals;

const moveTo = (gridSprite, { gridX, gridY }) => {
  const { scene } = gridSprite;
  return scene.tweens.add({
    targets: gridSprite,
    gridX,
    gridY,
    ease: 'Sine.easeIn',
    duration: BASE_SPEED,
  });
};

const moveUp = gridSprite =>
  moveTo(gridSprite, { gridX: gridSprite.gridX, gridY: gridSprite.gridY - 1 });

const moveDown = gridSprite =>
  moveTo(gridSprite, { gridX: gridSprite.gridX, gridY: gridSprite.gridY + 1 });

const moveLeft = gridSprite =>
  moveTo(gridSprite, { gridX: gridSprite.gridX - 1, gridY: gridSprite.gridY });

const moveRight = gridSprite =>
  moveTo(gridSprite, { gridX: gridSprite.gridX + 1, gridY: gridSprite.gridY });

export { moveUp, moveDown, moveLeft, moveRight };
