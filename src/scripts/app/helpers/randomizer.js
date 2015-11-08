class Randomizer {
  constructor (seed) {
    this.rng = new Phaser.RandomDataGenerator(seed);
  }

  integerInRange (min, max) {
    return this.rng.integerInRange(min, max);
  }

  pick (array) {
    return this.rng.pick(array);
  }
}

export default Randomizer;
