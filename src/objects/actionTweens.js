import globals from 'backstab/globals';

const { BASE_SPEED } = globals;

const bumpTween = (sprite, { x, y }) => ({
  targets: sprite,
  x,
  y,
  ease: 'Sine.easeIn',
  duration: BASE_SPEED,
  yoyo: true,
});

const moveTween = (sprite, { x, y }) => ({
  targets: sprite,
  x,
  y,
  ease: 'Sine.easeIn',
  duration: BASE_SPEED,
});

const damageEffectTween = (sprite, { x, y }) => ({
  targets: sprite,
  x,
  y,
  ease: 'Sine.easeIn',
  duration: BASE_SPEED * 2,
});

export { bumpTween, damageEffectTween, moveTween };
