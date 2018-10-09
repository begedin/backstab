import Entity from 'backstab/objects/Entity';
import { meleeAttack } from 'backstab/behavior/actions';

const isInMeleeRange = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;

const attackIfInMeleeRange = (attacker, defender) => {
  if (isInMeleeRange(attacker, defender)) {
    return meleeAttack(attacker, defender);
  }

  return null;
};

class Attacker extends Entity {
  constructor(feature, x, y, id) {
    super(
      x,
      y,
      id,
      'attacker',
      { strength: 2, constitution: 5, dexterity: 4, perception: 5 },
      { damage: 2, accuracy: 5 },
    );

    this.parentFeature = feature;
    this.seenPoints = [];
  }

  act({ player }) {
    return attackIfInMeleeRange(this, player);
  }

  alert() {
    this.isAlerted = true;
  }
}

export default Attacker;
