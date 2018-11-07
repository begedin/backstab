import { Terrain } from 'backstab/enums';
import Entity from 'backstab/Entity';

class Player extends Entity {
  constructor(id) {
    super(
      -1,
      -1,
      id,
      'Conan',
      'player',
      { strength: 5, constitution: 6, dexterity: 8, perception: 4 },
      { damage: 2, accuracy: 7 },
    );
    this.walkableTerrains = [Terrain.DIRT_FLOOR, Terrain.CORRIDOR];
    this.seenPoints = [];
  }
}

export default Player;
