import Phaser from 'phaser';
import * as Random from 'backstab/Random';
import CreatureFactory from 'backstab/CreatureFactory';
import DungeonGenerator from 'backstab/objects/dungeon/generator';
import Player from 'backstab/Player';

const spawnLevel = mapSize => new DungeonGenerator(mapSize, mapSize);

const spawnEnemies = level => {
  const enemies = level.features.map(feature => {
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

    feature.enemies.push(enemy);
    return enemy;
  });

  return enemies;
};

class Dungeon {
  constructor() {
    this.currentLevelIndex = -1;
    this.levels = [];
    this.mapSize = 80;
    this.player = new Player(Phaser.Utils.String.UUID());
  }

  ascend() {
    const { currentLevelIndex, levels } = this;
    if (!levels[currentLevelIndex + 1]) {
      this.spawnLevel();
    }

    this.currentLevelIndex += 1;
    const { startingLocation } = this.currentLevel;
    this.player.setPosition(startingLocation.x, startingLocation.y);
  }

  descend() {
    this.currentLevelIndex -= 1;
    const { startingLocation } = this.currentLevel;
    this.player.setPosition(startingLocation.x, startingLocation.y);
  }

  spawnLevel() {
    const level = spawnLevel(this.mapSize);
    level.enemies = spawnEnemies(level);
    this.levels.push(level);
  }

  get currentLevel() {
    return this.levels[this.currentLevelIndex];
  }
}

export default Dungeon;
