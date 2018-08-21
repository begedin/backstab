import globals from 'backstab/globals';

const { BASE_SPEED } = globals;

const attack = (attacker, { gridX, gridY }) => {
  const { scene } = attacker;
  return scene.tweens.add({
    targets: attacker,
    gridX,
    gridY,
    ease: 'Sine.easeIn',
    duration: BASE_SPEED,
    yoyo: true,
  });
};

// eslint-disable-next-line import/prefer-default-export
export { attack };
