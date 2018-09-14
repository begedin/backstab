import globals from 'backstab/globals';

const { BASE_SPEED } = globals;

const meleeAttackTween = (entity, { x, y }) => ({
  targets: entity,
  x,
  y,
  ease: 'Sine.easeIn',
  duration: BASE_SPEED,
  yoyo: true,
});

const moveTween = (entity, { x, y }) => ({
  targets: entity,
  x,
  y,
  ease: 'Sine.easeIn',
  duration: BASE_SPEED,
});

export { meleeAttackTween, moveTween };
