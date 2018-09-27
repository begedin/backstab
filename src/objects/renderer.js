import { gridToWorld } from 'backstab/objects/grid/convert';

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

  graphics.beginPath();
  enemy.seenPoints.forEach(({ x: vx, y: vy }) =>
    graphics.fillRect(
      gridToWorld(vx) - tileSize / 2,
      gridToWorld(vy) - tileSize / 2,
      tileSize,
      tileSize,
    ),
  );
  graphics.closePath();
  graphics.fillPath();
  return graphics;
};

const computeHealthBarGraphic = (graphics, enemy, tileSize) => {
  const { health, maxHealth, x, y } = enemy;

  graphics.clear();
  const left = x * tileSize;
  const top = y * tileSize - 15;
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

const createDungeonTileMap = (scene, gameData, tileSize, mapSize) => {
  const tilemapConfig = buildTilemapConfig(tileSize, mapSize);
  const dungeonTileMap = scene.make.tilemap(tilemapConfig);
  const tileset = dungeonTileMap.addTilesetImage(
    'tiles',
    'tiles',
    tileSize,
    tileSize,
    0,
    0,
  );

  dungeonTileMap.createBlankDynamicLayer('terrain', tileset);
  dungeonTileMap.createBlankDynamicLayer('features', tileset);

  const { dungeon } = gameData;

  dungeon.features.forEach(({ points, objects }) => {
    points.forEach(({ x, y, terrain }) => {
      dungeonTileMap.putTileAt(terrain, x, y, false, 'terrain');
    });

    objects.forEach(({ x, y, type }) => {
      dungeonTileMap.putTileAt(type, x, y, false, 'features');
    });
  });
};

const createPlayerSprite = (scene, gameData) => {
  const { dungeon } = gameData;
  const { startingLocation: playerPosition } = dungeon;

  return scene.add.sprite(
    gridToWorld(playerPosition.x),
    gridToWorld(playerPosition.y),
    'player',
  );
};

const createEnemySprites = (scene, { enemies }, tileSize) =>
  enemies.map(e => {
    const sprite = scene.add.sprite(gridToWorld(e.x), gridToWorld(e.y), e.name);
    sprite.lineOfSight = computeLineOfSightGraphic(
      scene.add.graphics(),
      e,
      tileSize,
    );
    sprite.healthBar = computeHealthBarGraphic(
      scene.add.graphics(),
      e,
      tileSize,
    );
    return sprite;
  });

const renderInitial = (scene, gameData, tileSize, mapSize) => {
  const dungeonTileMap = createDungeonTileMap(
    scene,
    gameData,
    tileSize,
    mapSize,
  );
  const playerSprite = createPlayerSprite(scene, gameData);
  const enemySprites = createEnemySprites(scene, gameData, tileSize);

  return { dungeonTileMap, enemySprites, playerSprite };
};

const updatePlayerState = (playerSprite, player) => {
  playerSprite.setPosition(gridToWorld(player.x), gridToWorld(player.y));
};

const updateEnemyStates = (enemySprites, enemies, tileSize) => {
  enemies.forEach(enemy => {
    const index = enemies.indexOf(enemy);
    const sprite = enemySprites[index];

    if (enemy.status === 'DEAD') {
      sprite.destroy();
      sprite.lineOfSight.destroy();
      sprite.healthBar.destroy();
    } else {
      computeLineOfSightGraphic(sprite.lineOfSight, enemy, tileSize);
      computeHealthBarGraphic(sprite.healthBar, enemy, tileSize);
      sprite.setPosition(gridToWorld(enemy.x), gridToWorld(enemy.y));
    }
  });
};

const renderUpdated = (scene, gameData, tileSize) => {
  const { playerSprite, enemySprites } = scene;
  const { player, enemies } = gameData;

  updatePlayerState(playerSprite, player);
  updateEnemyStates(enemySprites, enemies, tileSize);
};

export { renderInitial, renderUpdated };
