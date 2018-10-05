import * as Random from 'backstab/Random';

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
  constructor(attributes, weapon, name, id) {
    this.attributes = new Attributes(attributes);
    this.weapon = new Weapon(weapon);
    this.healthFactor = 1;
    this.name = name;
    this.id = id;
  }

  get maxHealth() {
    return this.healthFactor * this.attributes.constitution;
  }

  get inventoryCapacity() {
    return this.attributes.strength;
  }

  rollInitiative() {
    const initiative = Random.integerInRange(1, this.attributes.dexterity + 1);
    return initiative * 100;
  }

  didMeleeHit(target) {
    const accuracy = this.weapon.accuracy + this.attributes.strength;
    const dodgeFactor = Random.integerInRange(
      0,
      target.attributes.constitution,
    );
    return Random.integerInRange(0, accuracy) > dodgeFactor;
  }

  meleeDamage(/* target */) {
    const maxDamage = this.attributes.strength + this.weapon.damage;
    return Random.integerInRange(1, maxDamage);
  }

  // // TODO: computeDistance
  // didRangedHit(target) {
  //   const distance = computeDistance(this, target);
  //   return (
  //     Random.integerInRange(0, this.weapon.accuracy + this.attributes.dexterity) >
  //     Random.integerInRange(0, target.attributes.dexterity + distance)
  //   );
  // }
}

export default Entity;
