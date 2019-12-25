import Player from '@/Player';
import Dungeon from '@/Dungeon';
import Entity from '@/Entity';

export type GameData = {
  player: Player;
  dungeon: Dungeon;
  enemies: Entity[];
};
