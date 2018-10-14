import { integerInRange as randomIntegerInRange } from 'backstab/Random';
import computeSight from 'backstab/behavior/sight';

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

const move = (subject, location) => {
  subject.setPosition(location.x, location.y);
  subject.set('seenPoints', computeSight(subject));
  return { type: 'MOVE', outcome: { subject, target: location } };
};

const canMoveTo = (subject, location, dungeon) => {
  const tile = dungeon.tileAt(location.x, location.y);
  return tile && subject.walkableTerrains.indexOf(tile.terrain) > -1;
};

const enterPosition = (subject, location, dungeon, creatures) => {
  const creature = creatures.find(
    c => c.x === location.x && c.y === location.y && c.status !== 'DEAD',
  );

  if (creature) {
    return meleeAttack(subject, creature);
  }

  if (canMoveTo(subject, location, dungeon)) {
    return move(subject, location);
  }

  return { type: 'BUMP', outcome: { subject, target: location } };
};

const wait = subject => ({ type: 'WAIT', outcome: { subject } });

export { enterPosition, meleeAttack, wait };
