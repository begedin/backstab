import { maxHealth, inventoryCapacity } from 'backstab/behavior/attributes';

class Attributes {
  constructor({ strength, constitution, dexterity, perception }) {
    this.strength = strength;
    this.constitution = constitution;
    this.dexterity = dexterity;
    this.perception = perception;
  }
}

class Weapon {
  constructor({ damage, accuracy }) {
    this.damage = damage;
    this.accuracy = accuracy;
  }
}

class Entity {
  constructor(x, y, id, name, type, attributes, weapon) {
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
  }

  set(key, value) {
    this[key] = value;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default Entity;
