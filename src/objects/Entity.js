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
  constructor(attributes, weapon) {
    this.attributes = new Attributes(attributes);
    this.weapon = new Weapon(weapon);
    this.healthFactor = 1;
  }

  get maxHealth() {
    return this.healthFactor * this.attributes.constitution;
  }

  get inventoryCapacity() {
    return this.attributes.strength;
  }

  actsThisTurn(rng) {
    const initiative = rng.integerInRange(1, this.attributes.dexterity + 1);
    return initiative !== 1;
  }

  didMeleeHit(rng, target) {
    return (
      rng.integerInRange(0, this.weapon.accuracy + this.attributes.strength) >
      rng.integerInRange(0, target.attributes.constitution)
    );
  }

  meleeDamage(rng /* target */) {
    return rng.integerInRange(1, this.attributes.strength + this.weapon.damage);
  }

  // // TODO: computeDistance
  // didRangedHit(target) {
  //   const distance = computeDistance(this, target);
  //   return (
  //     rng.integerInRange(0, this.weapon.accuracy + this.attributes.dexterity) >
  //     rng.integerInRange(0, target.attributes.dexterity + distance)
  //   );
  // }
}

export default Entity;
