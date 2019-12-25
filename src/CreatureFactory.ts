import Phaser from 'phaser';
import Entity from '@/Entity';
import computeSight from '@/behavior/sight';
import { randomDirection } from '@/behavior/rotation';
import { Terrain } from '@/enums';
import Feature from './objects/dungeon/feature';

const CreatureFactory = {
  createDummy(feature: Feature, x: integer, y: integer): Entity {
    const id = Phaser.Utils.String.UUID();
    const name = 'Dummy';
    const type = 'dummy';

    const attributes = {
      strength: 1,
      constitution: 5,
      dexterity: 1,
      perception: 1,
    };
    const weapon = { damage: 0, accuracy: 1 };

    const creature = new Entity(x, y, id, name, type, attributes, weapon, feature);
    creature.walkableTerrains = [Terrain.DIRT_FLOOR, Terrain.CORRIDOR];
    return creature;
  },

  createAttacker(feature: Feature, x: integer, y: integer): Entity {
    const id = Phaser.Utils.String.UUID();
    const name = 'Attacker';
    const type = 'attacker';
    const attributes = {
      strength: 2,
      constitution: 5,
      dexterity: 4,
      perception: 5,
    };
    const weapon = { damage: 2, accuracy: 5 };

    const creature = new Entity(x, y, id, name, type, attributes, weapon, feature);
    creature.parentFeature = feature;
    creature.seenPoints = [];
    creature.walkableTerrains = [Terrain.DIRT_FLOOR, Terrain.CORRIDOR];
    return creature;
  },

  createPalantir(feature: Feature, x: integer, y: integer): Entity {
    const id = Phaser.Utils.String.UUID();
    const name = 'Palantir';
    const type = 'palantir';
    const attributes = {
      strength: 1,
      constitution: 5,
      dexterity: 1,
      perception: 1,
    };
    const weapon = { damage: 0, accuracy: 1 };

    const creature = new Entity(x, y, id, name, type, attributes, weapon, feature);
    creature.direction = randomDirection();
    creature.range = 4;
    creature.parentFeature = feature;
    creature.seenPoints = computeSight(creature);
    creature.timeSinceLastRotation = 0;
    creature.timeBetweenRotations = 4;
    creature.walkableTerrains = [Terrain.DIRT_FLOOR, Terrain.CORRIDOR];
    return creature;
  },
};

export default CreatureFactory;
