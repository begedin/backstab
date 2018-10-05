import Entity from 'backstab/objects/Entity';

class Dummy extends Entity {
  constructor(feature, x, y, id) {
    super(
      { strength: 1, constitution: 5, dexterity: 1, perception: 1 },
      { damage: 0, accuracy: 1 },
      'dummy',
      id,
    );
    this.healthFactor = 1;
    this.health = this.maxHealth;

    this.parentFeature = feature;
    this.x = x;
    this.y = y;
    this.seenPoints = [];
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.status = 'DEAD';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  act() {}

  alert() {
    this.isAlerted = true;
  }
}

export default Dummy;
