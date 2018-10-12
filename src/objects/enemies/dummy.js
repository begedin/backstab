import Entity from 'backstab/objects/Entity';

class Dummy extends Entity {
  constructor(feature, x, y, id) {
    super(
      x,
      y,
      id,
      'dummy',
      { strength: 1, constitution: 5, dexterity: 1, perception: 1 },
      { damage: 0, accuracy: 1 },
    );

    this.parentFeature = feature;
    this.seenPoints = [];
    this.state = 'dummy';
  }

  alert() {
    this.isAlerted = true;
  }
}

export default Dummy;
