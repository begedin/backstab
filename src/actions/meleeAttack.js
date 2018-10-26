import { integerInRange as randomIntegerInRange } from 'backstab/Random';

const meleeAccuracy = entity =>
  entity.weapon.accuracy + entity.attributes.strength;

const meleeDodgeFactor = entity =>
  randomIntegerInRange(0, entity.attributes.constitution);

const didMeleeHit = (attacker, defender) =>
  randomIntegerInRange(0, meleeAccuracy(attacker)) > meleeDodgeFactor(defender);

const maxMeleeDamage = attacker =>
  attacker.attributes.strength + attacker.weapon.damage;

const meleeDamage = attacker =>
  randomIntegerInRange(1, maxMeleeDamage(attacker));

const damage = (entity, amount) => {
  // eslint-disable-next-line no-param-reassign
  entity.health -= amount;
  if (entity.health <= 0) {
    // eslint-disable-next-line no-param-reassign
    entity.status = 'DEAD';
  }
};

const meleeAttack = (attacker, target) => {
  let value;

  if (didMeleeHit(attacker, target)) {
    const amount = meleeDamage(attacker);
    damage(target, amount);
    value = amount;
  } else {
    value = 'MISS';
  }

  return {
    type: 'MELEE_ATTACK',
    outcome: { subject: attacker, target, value },
  };
};

export default meleeAttack;
