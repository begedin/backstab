class Dummy {
  constructor(feature, x, y) {
    this.parentFeature = feature;
    this.health = 1;
    this.x = x;
    this.y = y;
    this.name = 'dummy';
  }

  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.status = 'DEAD';
    }
  }
}

export default Dummy;
