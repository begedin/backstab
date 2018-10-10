import { gridToWorld } from 'backstab/objects/grid/convert';
import { Terrain } from 'backstab/enums';
import { pick as randomPick } from 'backstab/Random';

const buildTilemapConfig = (tileSize, mapSize) => ({
  tileWidth: tileSize,
  tileHeight: tileSize,
  width: mapSize,
  height: mapSize,
});

const computeLineOfSightGraphic = (graphics, enemy, tileSize) => {
  graphics.clear();

  if (enemy.isAlerted) {
    graphics.fillStyle(0xff0000, 1);
  } else {
    graphics.fillStyle(0xff700b, 1);
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

const terrainToTileIndex = terrain => {
  switch (terrain) {
    case Terrain.DIRT_FLOOR:
      return randomPick([6]);
    case Terrain.DIRT_WALL:
      return randomPick([7]);
    default:
      return 0;
  }
};

const objectToTileIndex = object => {
  switch (object) {
    case Terrain.DOOR:
      return randomPick([32, 33]);
    default:
      return 0;
  }
};

const createDungeonTileMap = (scene, gameData, tileSize, mapSize) => {
  const tilemapConfig = buildTilemapConfig(tileSize, mapSize);
  const dungeonTileMap = scene.make.tilemap(tilemapConfig);
  const tileset = dungeonTileMap.addTilesetImage(
    'tileset',
    'tileset',
    tileSize,
    tileSize,
    0,
    1,
  );

  dungeonTileMap.createBlankDynamicLayer('terrain', tileset);
  dungeonTileMap.createBlankDynamicLayer('features', tileset);

  const { dungeon } = gameData;

  dungeon.features.forEach(({ points, objects }) => {
    points.forEach(({ x, y, terrain }) => {
      const tile = terrainToTileIndex(terrain);
      dungeonTileMap.putTileAt(tile, x, y, false, 'terrain');
    });

    objects.forEach(({ x, y, type }) => {
      const tile = objectToTileIndex(type);
      dungeonTileMap.putTileAt(tile, x, y, false, 'features');
    });
  });
};

const frames = {
  dummy: 0,
  attacker: 54,
  palantir: 108,
  player: 162,
};

const createPlayerContainer = scene => {
  const { dungeon, player } = scene.gameData;
  const { startingLocation: p } = dungeon;
  const sprite = scene.add.sprite(0, 0, 'characters', frames.player);
  sprite.name = 'sprite';
  return scene.add
    .container(gridToWorld(p.x), gridToWorld(p.y), [sprite])
    .setData('id', player.id);
};

const createEnemyContainers = (scene, tileSize) =>
  scene.gameData.enemies.map(e => {
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
  const dungeonTileMap = createDungeonTileMap(
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
