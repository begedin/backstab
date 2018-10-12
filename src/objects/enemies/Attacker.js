import Entity from 'backstab/objects/Entity';

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
    this.state = 'attacker';
  }

  alert() {
    this.isAlerted = true;
  }
}

export default Attacker;
