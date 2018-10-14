import Phaser from 'phaser';
import Entity from 'backstab/Entity';
import computeSight from 'backstab/behavior/sight';
import { randomDirection } from 'backstab/behavior/rotation';
import { Terrain } from 'backstab/enums';

const CreatureFactory = {
  createDummy(feature, x, y) {
    const id = Phaser.Utils.String.UUID();
    const name = 'dummy';

    const attributes = {
      strength: 1,
      constitution: 5,
      dexterity: 1,
      perception: 1,
    };
    const weapon = { damage: 0, accuracy: 1 };

    const creature = new Entity(x, y, id, name, attributes, weapon);
    creature.set('parentFeature', feature);
    creature.set('seenPoints', []);
    creature.set('walkableTerrains', [Terrain.DIRT_FLOOR, Terrain.CORRIDOR]);
    return creature;
  },

  createAttacker(feature, x, y) {
    const id = Phaser.Utils.String.UUID();
    const name = 'attacker';
    const attributes = {
      strength: 2,
      constitution: 5,
      dexterity: 4,
      perception: 5,
    };
    const weapon = { damage: 2, accuracy: 5 };

    const creature = new Entity(x, y, id, name, attributes, weapon);
    creature.set('parentFeature', feature);
    creature.set('seenPoints', []);
    creature.set('walkableTerrains', [Terrain.DIRT_FLOOR, Terrain.CORRIDOR]);
    return creature;
  },

  createPalantir(feature, x, y) {
    const id = Phaser.Utils.String.UUID();
    const name = 'palantir';
    const attributes = {
      strength: 1,
      constitution: 5,
      dexterity: 1,
      perception: 1,
    };
    const weapon = { damage: 0, accuracy: 1 };

    const creature = new Entity(x, y, id, name, attributes, weapon);
    creature.set('direction', randomDirection());
    creature.set('range', 4);
    creature.set('parentFeature', feature);
    creature.set('seenPoints', computeSight(creature));
    creature.set('timeSinceLastRotation', 0);
    creature.set('timeBetweenRotations', 4);
    creature.set('walkableTerrains', [Terrain.DIRT_FLOOR, Terrain.CORRIDOR]);
    return creature;
  },
};

export default CreatureFactory;
