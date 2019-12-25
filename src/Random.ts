import Phaser from 'phaser';

const rng = new Phaser.Math.RandomDataGenerator([Date.now().toString()]);

const integerInRange = (min: integer, max: integer): integer => rng.integerInRange(min, max);
const pick = <T = number>(array: T[]): T => rng.pick(array);

const weightedPick = <T = number>(array: { item: T; weight: number }[]): T => {
  const sum = array.reduce((prev, curr) => prev + curr.weight, 0);

  const result = integerInRange(0, sum);

  let current = 0;
  const pick = array.find(item => {
    current += item.weight;
    return current >= result;
  });

  if (!pick) throw 'weightedPick failed to find item. Probable bug.';

  return pick.item;
};

const frac = (): number => rng.frac();

export { integerInRange, pick, weightedPick, frac };
