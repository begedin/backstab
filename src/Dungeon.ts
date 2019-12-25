import Phaser from 'phaser';
import * as Random from '@/Random';
import CreatureFactory from '@/CreatureFactory';
import DungeonGenerator from '@/objects/dungeon/generator';
import Player from '@/Player';
import DungeonLevel from './objects/DungeonLevel';
import Entity from './Entity';

const spawnLevel = (mapSize: number, isTopLevel: boolean): DungeonLevel =>
  DungeonGenerator.createLevel(mapSize, mapSize, isTopLevel);

const spawnEnemies = (level: DungeonLevel): Entity[] => {
  const enemies: Entity[] = [];
  level.features.forEach(feature => {
    const { x, y } = Random.pick(feature.innerPoints);

    let enemy;

    switch (Random.pick([3, 3, 3])) {
      case 1:
        enemy = CreatureFactory.createDummy(feature, x, y);
        break;
      case 2:
        enemy = CreatureFactory.createAttacker(feature, x, y);
        break;
      case 3:
        enemy = CreatureFactory.createPalantir(feature, x, y);
        break;
      default:
        break;
    }

    if (enemy) {
      feature.enemies.push(enemy);
    }
  });

  return enemies;
};

class Dungeon {
  currentLevelIndex: number;
  levels: DungeonLevel[];
  mapSize: number;
  player: Player;

  constructor() {
    this.currentLevelIndex = -1;
    this.levels = [];
    this.mapSize = 80;
    this.player = new Player(Phaser.Utils.String.UUID());
  }

  descend(): void {
    const { currentLevelIndex, levels } = this;
    if (!levels[currentLevelIndex + 1]) {
      this.spawnLevel();
    }

    this.currentLevelIndex += 1;
    const { startingLocation } = this.currentLevel;
    this.player.setPosition(startingLocation.x, startingLocation.y);
  }

  ascend(): void {
    this.currentLevelIndex -= 1;

    const { stairsDownLocation } = this.currentLevel;
    this.player.setPosition(stairsDownLocation.x, stairsDownLocation.y);
  }

  spawnLevel(): void {
    const level = spawnLevel(this.mapSize, this.levels.length === 0);
    level.enemies = spawnEnemies(level);
    this.levels.push(level);
  }

  get currentLevel(): DungeonLevel {
    return this.levels[this.currentLevelIndex];
  }
}

export default Dungeon;
