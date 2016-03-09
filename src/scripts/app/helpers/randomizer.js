class Randomizer {
  constructor (seed) {
    this.rng = new Phaser.RandomDataGenerator([seed || Date.now().toString()]);
  }

  integerInRange (min, max) {
    return this.rng.integerInRange(min, max);
  }

  pick (array) {
    return this.rng.pick(array);
  }

  weightedPick(array) {
    let sum = array.reduce((prev, curr) => prev + curr.weight, 0);

    let result = this.integerInRange(0, sum);

    let current = 0;
    return array.find((item) => {
      current += item.weight;
      return (current >= result);
    }).item;
  }
}

export default Randomizer;
