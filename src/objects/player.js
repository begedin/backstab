import GridSprite from 'backstab/objects/grid_sprite';
import { Terrain } from 'backstab/enums';
import {
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
} from 'backstab/objects/grid/movement';

const STATES = {
  IDLE: 0,
  MOVING: 1,
};

const canWalkOn = terrain =>
  terrain === Terrain.DIRT_FLOOR ||
  terrain === Terrain.DOOR ||
  terrain === Terrain.CORRIDOR;

class Player extends GridSprite {
  constructor(scene, dungeon, gridX, gridY) {
    super(scene, gridX, gridY, 'player');
    this.dungeon = dungeon;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.state = STATES.IDLE;
  }

  update() {
    if (this.state === STATES.IDLE) {
      this.handleMovement();
    }
  }

  handleMovement() {
    const { cursors, scene } = this;
    const isCursorKeyPressed =
      cursors.up.isDown ||
      cursors.down.isDown ||
      cursors.left.isDown ||
      cursors.right.isDown;

    if (isCursorKeyPressed) {
      scene.cameras.main.startFollow(this);
    }

    let action;

    if (cursors.up.isDown && this.canMoveUp) {
      action = moveUp(this);
    } else if (cursors.right.isDown && this.canMoveRight) {
      action = moveRight(this);
    } else if (cursors.down.isDown && this.canMoveDown) {
      action = moveDown(this);
    } else if (cursors.left.isDown && this.canMoveLeft) {
      action = moveLeft(this);
    }

    if (action) {
      this.state = STATES.MOVING;
      action.setCallback(
        'onComplete',
        () => {
          this.state = STATES.IDLE;
        },
        [],
        this,
      );
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
