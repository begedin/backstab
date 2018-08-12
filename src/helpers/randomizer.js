import Phaser from 'phaser';

class Randomizer {
  constructor(seed) {
    this.rng = new Phaser.Math.RandomDataGenerator([
      seed || Date.now().toString(),
    ]);
  }

  integerInRange(min, max) {
    return this.rng.integerInRange(min, max);
  }

  pick(array) {
    return this.rng.pick(array);
  }

  weightedPick(array) {
    const sum = array.reduce((prev, curr) => prev + curr.weight, 0);

    const result = this.integerInRange(0, sum);

    let current = 0;
    return array.find(item => {
      current += item.weight;
      return current >= result;
    }).item;
  }
}

export default Randomizer;
