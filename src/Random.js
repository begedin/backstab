import Phaser from 'phaser';

const rng = new Phaser.Math.RandomDataGenerator([Date.now().toString()]);

const integerInRange = (min, max) => rng.integerInRange(min, max);
const pick = array => rng.pick(array);

const weightedPick = array => {
  const sum = array.reduce((prev, curr) => prev + curr.weight, 0);

  const result = integerInRange(0, sum);

  let current = 0;
  return array.find(item => {
    current += item.weight;
    return current >= result;
  }).item;
};

export { integerInRange, pick, weightedPick };
