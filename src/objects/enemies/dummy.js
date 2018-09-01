import GridSprite from 'backstab/objects/grid_sprite';

class Dummy extends GridSprite {
  constructor(scene, feature, gridX, gridY) {
    super(scene, gridX, gridY, 'dummy');
    this.parentFeature = feature;
    this.health = 1;
  }

  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      const index = this.scene.enemies.indexOf(this);
      this.scene.enemies.splice(index, 1);
      this.destroy();
    }
  }
}

export default Dummy;
