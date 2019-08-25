import { maxHealth, inventoryCapacity } from '@/behavior/attributes';
import { Location } from '@/actions/Location';

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

type EntityType = 'player' | 'enemy';
type EntityStatus = 'ALIVE' | 'DEAD';

class Entity {
  x: number | null = null;
  y: number | null = null;
  id: string;
  name: string;
  type: EntityType;
  attributes: Attributes;
  weapon: Weapon;

  maxHealth: number;
  health: number;
  inventoryCapacity: number;
  status: EntityStatus;
  seenPoints: Location[] | null = null;
  direction: 0 | 1 | 2 | 3 = 0;
  walkableTerrains: number[] = [];
  range = 1;
  parentFeature: unknown;

  constructor(
    x: number,
    y: number,
    id: string,
    name: string,
    type: EntityType,
    attributes: AttributeValues,
    weapon: WeaponValues,
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
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export default Entity;
