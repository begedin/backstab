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

const canMoveTo = tile => tile !== undefined && canWalkOn(tile);

const canMoveUp = ({ gridX, gridY }, dungeon) =>
  canMoveTo(dungeon.tileAt(gridX, gridY - 1));

const canMoveDown = ({ gridX, gridY }, dungeon) =>
  canMoveTo(dungeon.tileAt(gridX, gridY + 1));

const canMoveRight = ({ gridX, gridY }, dungeon) =>
  canMoveTo(dungeon.tileAt(gridX + 1, gridY));

const canMoveLeft = ({ gridX, gridY }, dungeon) =>
  canMoveTo(dungeon.tileAt(gridX - 1, gridY));

class Player extends GridSprite {
  constructor(scene, gridX, gridY) {
    super(scene, gridX, gridY, 'player');
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.state = STATES.IDLE;
  }

  update(dungeon) {
    if (this.state === STATES.IDLE) {
      this.handleMovement(dungeon);
    }
  }

  handleMovement(dungeon) {
    const {
      cursors: { up, down, left, right },
      scene,
    } = this;
    const isCursorKeyPressed =
      up.isDown || down.isDown || left.isDown || right.isDown;

    if (isCursorKeyPressed) {
      scene.cameras.main.startFollow(this);
    }

    let action;

    if (up.isDown && canMoveUp(this, dungeon)) {
      action = moveUp(this);
    } else if (right.isDown && canMoveRight(this, dungeon)) {
      action = moveRight(this);
    } else if (down.isDown && canMoveDown(this, dungeon)) {
      action = moveDown(this);
    } else if (left.isDown && canMoveLeft(this, dungeon)) {
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
}

export default Player;
