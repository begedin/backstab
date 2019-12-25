import { maxHealth, inventoryCapacity } from '@/behavior/attributes';
import { Location } from '@/actions/Location';
import { STATES } from './ai/decide';
import Feature, { DungeonPoint } from './objects/dungeon/feature';
import { Direction } from './actions/performPlayerCommand';

export type AttributeValues = {
  strength: number;
  constitution: number;
  dexterity: number;
  perception: number;
};

class Attributes {
  strength = 0;
  constitution = 0;
  dexterity = 0;
  perception = 0;

  constructor({ strength, constitution, dexterity, perception }: AttributeValues) {
    this.strength = strength;
    this.constitution = constitution;
    this.dexterity = dexterity;
    this.perception = perception;
  }
}

export type WeaponValues = {
  damage: number;
  accuracy: number;
};

class Weapon {
  damage = 0;
  accuracy = 0;

  constructor({ damage, accuracy }: WeaponValues) {
    this.damage = damage;
    this.accuracy = accuracy;
  }
}

type EntityType = 'player' | 'attacker' | 'palantir' | 'dummy';
type EntityStatus = 'ALIVE' | 'DEAD';

class Entity {
  x: number;
  y: number;
  id: string;
  name: string;
  type: EntityType;
  attributes: Attributes;
  weapon: Weapon;
  state: string;
  isAlerted: boolean;
  lastKnownPlayerPosition: DungeonPoint | null = null;

  maxHealth: number;
  health: number;
  inventoryCapacity: number;
  status: EntityStatus;
  seenPoints: Location[] | null = null;
  direction: Direction = 'UP';
  walkableTerrains: number[] = [];
  range = 1;
  parentFeature: Feature | null;

  timeSinceLastRotation = 0;
  timeBetweenRotations = 0;

  patrolTarget: DungeonPoint | null = null;
  patrolPath: DungeonPoint[] | null = null;

  constructor(
    x: number,
    y: number,
    id: string,
    name: string,
    type: EntityType,
    attributes: AttributeValues,
    weapon: WeaponValues,
    parentFeature: Feature | null = null,
  ) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.name = name;
    this.type = type;

    this.attributes = new Attributes(attributes);
    this.weapon = new Weapon(weapon);

    this.maxHealth = maxHealth(this);
    this.health = this.maxHealth;
    this.inventoryCapacity = inventoryCapacity(this);
    this.status = 'ALIVE';
    this.state = STATES.STANDING;
    this.isAlerted = false;
    this.parentFeature = parentFeature;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export default Entity;
