import computeSight from 'backstab/behavior/sight';
import Entity from 'backstab/objects/Entity';
import { randomDirection } from 'backstab/behavior/rotation';

class Palantir extends Entity {
  constructor(feature, x, y, id) {
    super(
      x,
      y,
      id,
      'palantir',
      { strength: 1, constitution: 5, dexterity: 1, perception: 1 },
      { damage: 0, accuracy: 1 },
    );

    this.direction = randomDirection();
    this.range = 4;
    this.parentFeature = feature;

    this.seenPoints = computeSight(this);
    this.timeSinceLastRotate = 0;
    this.timeBetweenRotations = 4;
  }
}

export default Palantir;
