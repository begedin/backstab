import { Tiles } from 'backstab/enums';
import Entity from 'backstab/objects/Entity';

class Player extends Entity {
  constructor(x, y, id) {
    super(
      { strength: 5, constitution: 6, dexterity: 8, perception: 4 },
      { damage: 2, accuracy: 7 },
      'Conan',
      id,
    );
    this.x = x;
    this.y = y;
    this.meleeAttack = 1;

    this.healthFactor = 3;
    this.health = this.maxHealth;
    this.walkableTerrains = [Tiles.DIRT_FLOOR, Tiles.DOOR, Tiles.CORRIDOR];
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default Player;
