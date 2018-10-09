import { integerInRange as randomIntegerInRange } from 'backstab/Random';

const maxHealth = entity => entity.attributes.constitution * 2;
const inventoryCapacity = entity => entity.attributes.strength;

const turnEnergy = entity =>
  randomIntegerInRange(1, entity.attributes.dexterity + 1) * 100;

export { maxHealth, inventoryCapacity, turnEnergy };
