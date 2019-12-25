import enterPosition from '@/actions/enterPosition';
import goDownStairs from '@/actions/goDownStairs';
import goUpStairs from '@/actions/goUpStairs';
import wait from '@/actions/wait';
import { DungeonPoint } from '@/objects/dungeon/feature';
import { ActionOutcome } from './ActionOutcome';
import { GameData } from '@/types/GameData';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const getCoordinatesFromDirection = (
  { x, y }: DungeonPoint,
  direction: Direction,
): DungeonPoint => {
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

export type Command = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'WAIT' | 'STAIRS_DOWN' | 'STAIRS_UP';

const performPlayerCommand = (
  command: Command,
  { player, dungeon, enemies }: GameData,
): ActionOutcome | null => {
  switch (command) {
    case 'UP':
    case 'DOWN':
    case 'LEFT':
    case 'RIGHT':
      return enterPosition(player, getCoordinatesFromDirection(player, command), dungeon, enemies);
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
