import { gridToWorld } from 'backstab/objects/grid/convert';
import renderDungeon from 'backstab/renderers/dungeon';

const computeLineOfSightGraphic = (graphics, enemy, tileSize) => {
  graphics.clear();

  if (enemy.isAlerted) {
    graphics.fillStyle(0xff0000, 0.5);
  } else {
    graphics.fillStyle(0xff700b, 0.5);
  }

  const { x: ex, y: ey } = enemy;

  graphics.beginPath();
  enemy.seenPoints.forEach(({ x: vx, y: vy }) =>
    graphics.fillRect(
      gridToWorld(vx - ex) - tileSize,
      gridToWorld(vy - ey) - tileSize,
      tileSize,
      tileSize,
    ),
  );
  graphics.closePath();
  graphics.fillPath();
  return graphics;
};

const computeHealthBarGraphic = (graphics, enemy, tileSize) => {
  const { health, maxHealth } = enemy;

  graphics.clear();
  const left = 0 - tileSize / 2;
  const top = -15 - tileSize / 2;
  const width = tileSize;
  const height = 10;

  graphics.fillStyle(0x000000);
  graphics.fillRect(left, top, width, height);

  graphics.fillStyle(0xff0000);
  const innerMax = tileSize - 4;
  const innerLeft = left + 2;
  const innerTop = top + 2;
  const innerWidth = (health / maxHealth) * innerMax;
  const innerHeight = height - 4;

  graphics.fillRect(innerLeft, innerTop, innerWidth, innerHeight);

  return graphics;
};

const frames = {
  dummy: 'character-2',
  attacker: 'character-12',
  palantir: 'character-7',
  player: 'character-22',
};

const createPlayerContainer = scene => {
  const { player } = scene.gameData.dungeon;
  const sprite = scene.add.sprite(0, 0, 'characters', frames.player);
  sprite.name = 'sprite';
  return scene.add
    .container(gridToWorld(player.x), gridToWorld(player.y), [sprite])
    .setData('id', player.id);
};

const createEnemyContainers = (scene, tileSize) =>
  scene.gameData.dungeon.currentLevel.enemies.map(e => {
    const sprite = scene.add.sprite(0, 0, 'characters', frames[e.name]);
    sprite.name = 'sprite';

    const lineOfSight = scene.add.graphics();
    computeLineOfSightGraphic(lineOfSight, e, tileSize);
    lineOfSight.name = 'lineOfSight';

    const healthBar = scene.add.graphics();
    computeHealthBarGraphic(healthBar, e, tileSize);
    healthBar.name = 'healthBar';

    const children = [sprite, lineOfSight, healthBar];
    return scene.add
      .container(gridToWorld(e.x), gridToWorld(e.y), children)
      .setData('id', e.id);
  });

const renderInitial = (scene, tileSize, mapSize) => {
  const dungeonTileMap = renderDungeon(
    scene,
    scene.gameData,
    tileSize,
    mapSize,
  );
  const playerContainer = createPlayerContainer(scene);
  const enemyContainers = createEnemyContainers(scene, tileSize);

  return { dungeonTileMap, enemyContainers, playerContainer };
};

const updateEnemyStates = (enemyContainers, enemies, tileSize) =>
  enemies.forEach(enemy => {
    const index = enemies.indexOf(enemy);
    const container = enemyContainers[index];

    if (enemy.status === 'DEAD') {
      return container.destroy();
    }

    const lineOfSight = container.getByName('lineOfSight');
    computeLineOfSightGraphic(lineOfSight, enemy, tileSize);

    const healthBar = container.getByName('healthBar');
    computeHealthBarGraphic(healthBar, enemy, tileSize);

    return container;
  });

const renderUpdated = (scene, tileSize) => {
  const { renderData, gameData } = scene;
  const { enemyContainers } = renderData;
  const { enemies } = gameData;

  updateEnemyStates(enemyContainers, enemies, tileSize);
};

export { renderInitial, renderUpdated };
