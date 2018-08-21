import GridSprite from 'backstab/objects/grid_sprite';

class Dummy extends GridSprite {
  constructor(scene, gridX, gridY) {
    super(scene, gridX, gridY, 'player');
    this.health = 1;
  }

  damage(amount) {
    this.health -= amount;
  }

  update() {
    if (this.health <= 0) {
      const index = this.scene.enemies.indexOf(this);
      this.scene.enemies.splice(index, 1);
      this.destroy();
    }
  }
}

export default Dummy;
