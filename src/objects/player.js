import GridSprite from 'backstab/objects/grid_sprite';
import { Terrain } from 'backstab/enums';
import { moveTo } from 'backstab/objects/grid/movement';
import { attack } from 'backstab/objects/grid/attack';

const STATES = {
  IDLE: 0,
  MOVING: 1,
  ATTACKING: 2,
};

const canWalkOn = terrain =>
  terrain === Terrain.DIRT_FLOOR ||
  terrain === Terrain.DOOR ||
  terrain === Terrain.CORRIDOR;

const canMoveTo = tile => tile !== undefined && canWalkOn(tile.terrain);

const handleMovement = (player, dungeon, { x, y }) => {
  if (!canMoveTo(dungeon.tileAt(x, y))) {
    return false;
  }

  const action = moveTo(player, { gridX: x, gridY: y });

  player.setState(STATES.MOVING);
  action.setCallback(
    'onComplete',
    () => {
      player.setState(STATES.IDLE);
    },
    [],
  );

  return true;
};

const handleMelee = (player, enemies, { x, y }) => {
  const enemy = enemies.find(({ gridX, gridY }) => x === gridX && y === gridY);

  if (!enemy) {
    return false;
  }

  player.setState(STATES.ATTACKING);
  const action = attack(player, enemy);
  action.setCallback(
    'onComplete',
    () => {
      enemy.damage(1);
      player.setState(STATES.IDLE);
    },
    [],
  );

  return true;
};

const getNextGridField = (
  { gridX: x, gridY: y },
  { up, down, left, right },
) => {
  if (up.isDown) {
    return { x, y: y - 1 };
  }
  if (right.isDown) {
    return { x: x + 1, y };
  }
  if (down.isDown) {
    return { x, y: y + 1 };
  }
  if (left.isDown) {
    return { x: x - 1, y };
  }

  return null;
};

class Player extends GridSprite {
  constructor(scene, gridX, gridY) {
    super(scene, gridX, gridY, 'player');
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.state = STATES.IDLE;
  }

  update(enemies, dungeon) {
    if (this.state !== STATES.IDLE) {
      return false;
    }

    const {
      cursors: { up, down, left, right },
      scene,
    } = this;
    const isCursorKeyPressed =
      up.isDown || down.isDown || left.isDown || right.isDown;

    if (!isCursorKeyPressed) {
      return false;
    }

    scene.cameras.main.startFollow(this);
    const nextGridField = getNextGridField(this, { up, down, left, right });

    if (handleMelee(this, enemies, nextGridField)) {
      return true;
    }

    handleMovement(this, dungeon, nextGridField);
    return true;
  }

  setState(state) {
    this.state = state;
  }
}

export default Player;
