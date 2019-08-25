import { integerInRange as randomIntegerInRange } from '@/Random';
import Entity from '@/Entity';
import { ActionOutcome } from '@/actions/ActionOutcome';

const meleeAccuracy = (entity: Entity): number =>
  entity.weapon.accuracy + entity.attributes.strength;

const meleeDodgeFactor = (entity: Entity): number =>
  randomIntegerInRange(0, entity.attributes.constitution);

const didMeleeHit = (attacker: Entity, defender: Entity): boolean =>
  randomIntegerInRange(0, meleeAccuracy(attacker)) > meleeDodgeFactor(defender);

const maxMeleeDamage = (attacker: Entity): number =>
  attacker.attributes.strength + attacker.weapon.damage;

const meleeDamage = (attacker: Entity): number => randomIntegerInRange(1, maxMeleeDamage(attacker));

const damage = (entity: Entity, amount: number): void => {
  entity.health -= amount;
  if (entity.health <= 0) {
    entity.status = 'DEAD';
  }
};

const meleeAttack = (attacker: Entity, target: Entity): ActionOutcome => {
  let value: ActionOutcome['outcome']['value'];

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
