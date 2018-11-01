import enterPosition from 'backstab/actions/enterPosition';
import goDownStairs from 'backstab/actions/goDownStairs';
import goUpStairs from 'backstab/actions/goUpStairs';
import wait from 'backstab/actions/wait';

const getCoordinatesFromDirection = ({ x, y }, direction) => {
  switch (direction) {
    case 'UP':
      return { x, y: y - 1 };
    case 'DOWN':
      return { x, y: y + 1 };
    case 'LEFT':
      return { x: x - 1, y };
    case 'RIGHT':
      return { x: x + 1, y };
    default:
      throw new Error('Invalid direction');
  }
};

const performPlayerCommand = (command, { player, dungeon, enemies }) => {
  switch (command) {
    case 'UP':
    case 'DOWN':
    case 'LEFT':
    case 'RIGHT':
      return enterPosition(
        player,
        getCoordinatesFromDirection(player, command),
        dungeon,
        enemies,
      );
    case 'WAIT':
      return wait(player);
    case 'STAIRS_DOWN':
      return goDownStairs(player, dungeon);
    case 'STAIRS_UP':
      return goUpStairs(player, dungeon);
    default:
      return null;
  }
};

export default performPlayerCommand;
