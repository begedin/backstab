import { Tiles } from 'backstab/enums';

const canWalkOn = terrain =>
  terrain === Tiles.DIRT_FLOOR ||
  terrain === Tiles.DOOR ||
  terrain === Tiles.CORRIDOR;

const canMoveTo = tile => tile && canWalkOn(tile.terrain);

const attemptMoveTo = (player, { x, y }, enemies, dungeon) => {
  const enemy = enemies.find(e => e.x === x && e.y === y);

  if (enemy && enemy.status !== 'DEAD') {
    return { type: 'ATTACKING', data: enemy };
  }

  if (canMoveTo(dungeon.tileAt(x, y))) {
    return { type: 'MOVING', data: { x, y } };
  }

  return null;
};

const actionUp = (player, { enemies, dungeon }) =>
  attemptMoveTo(player, { x: player.x, y: player.y - 1 }, enemies, dungeon);

const actionDown = (player, { enemies, dungeon }) =>
  attemptMoveTo(player, { x: player.x, y: player.y + 1 }, enemies, dungeon);

const actionLeft = (player, { enemies, dungeon }) =>
  attemptMoveTo(player, { x: player.x - 1, y: player.y }, enemies, dungeon);

const actionRight = (player, { enemies, dungeon }) =>
  attemptMoveTo(player, { x: player.x + 1, y: player.y }, enemies, dungeon);

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.meleeAttack = 1;
    this.health = 10;
    this.maxHealth = 10;
  }

  command(type, gameData) {
    switch (type) {
      case 'UP':
        return actionUp(this, gameData);
      case 'DOWN':
        return actionDown(this, gameData);
      case 'LEFT':
        return actionLeft(this, gameData);
      case 'RIGHT':
        return actionRight(this, gameData);
      default:
        throw new Error('Unsupported action');
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default Player;
