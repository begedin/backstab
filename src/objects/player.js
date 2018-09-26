import { Tiles } from 'backstab/enums';
import Entity from 'backstab/objects/Entity';

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

class Player extends Entity {
  constructor(x, y) {
    super(
      { strength: 5, constitution: 6, dexterity: 8, perception: 4 },
      { damage: 2, accuracy: 7 },
    );
    this.x = x;
    this.y = y;
    this.meleeAttack = 1;

    this.healthFactor = 3;
    this.health = this.maxHealth;
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
