import GridSprite from 'backstab/objects/grid_sprite';
import { Terrain } from 'backstab/enums';

const canWalkOn = terrain =>
  terrain === Terrain.DIRT_FLOOR ||
  terrain === Terrain.DOOR ||
  terrain === Terrain.CORRIDOR;

class Player extends GridSprite {
  constructor(scene, dungeon, gridX, gridY) {
    super(scene, gridX, gridY, 'player');
    this.dungeon = dungeon;
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this.isMoving) {
      this.handleMovement();
    }
  }

  handleMovement() {
    const isCursorKeyPressed =
      this.cursors.up.isDown ||
      this.cursors.down.isDown ||
      this.cursors.left.isDown ||
      this.cursors.right.isDown;

    if (isCursorKeyPressed) {
      this.scene.cameras.main.startFollow(this);
    }

    if (this.cursors.up.isDown && this.canMoveUp) {
      this.moveUp();
    } else if (this.cursors.right.isDown && this.canMoveRight) {
      this.moveRight();
    } else if (this.cursors.down.isDown && this.canMoveDown) {
      this.moveDown();
    } else if (this.cursors.left.isDown && this.canMoveLeft) {
      this.moveLeft();
    }
  }

  get canMoveUp() {
    const tile = this.dungeon.tileAt(this.gridX, this.gridY - 1);
    return tile !== undefined && canWalkOn(tile);
  }

  get canMoveDown() {
    const tile = this.dungeon.tileAt(this.gridX, this.gridY + 1);
    return tile !== undefined && canWalkOn(tile);
  }

  get canMoveRight() {
    const tile = this.dungeon.tileAt(this.gridX + 1, this.gridY);
    return tile !== undefined && canWalkOn(tile);
  }

  get canMoveLeft() {
    const tile = this.dungeon.tileAt(this.gridX - 1, this.gridY);
    return tile !== undefined && canWalkOn(tile);
  }
}

export default Player;
