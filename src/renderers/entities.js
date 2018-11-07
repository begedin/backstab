import { gridToWorld } from 'backstab/objects/grid/convert';
import renderDungeon from 'backstab/renderers/dungeon';

const computeLineOfSightGraphic = (graphics, entity, tileSize) => {
  graphics.clear();

  if (entity.isAlerted) {
    graphics.fillStyle(0xff0000, 0.5);
  } else {
    graphics.fillStyle(0xff700b, 0.5);
  }

  const { x: ex, y: ey } = entity;

  graphics.beginPath();
  entity.seenPoints.forEach(({ x: vx, y: vy }) =>
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

const computeHealthBarGraphic = (graphics, entity, tileSize) => {
  const { health, maxHealth } = entity;

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

const createEntities = (scene, entities, tileSize) =>
  entities.map(e => {
    const sprite = scene.add.sprite(0, 0, 'characters', frames[e.type]);
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
  const { gameData } = scene;
  const dungeonTileMap = renderDungeon(scene, gameData, tileSize, mapSize);

  const { player } = gameData.dungeon;
  const { enemies } = gameData.dungeon.currentLevel;
  const entities = createEntities(scene, enemies.concat([player]), tileSize);
  return { dungeonTileMap, entities };
};

const updateEntities = (scene, renderedEntities, entities, tileSize) =>
  entities.forEach(entity => {
    const container = renderedEntities.find(r => r.getData('id') === entity.id);

    if (!container) {
      return;
    }

    if (entity.status === 'DEAD') {
      return container.destroy();
    }

    const lineOfSight = container.getByName('lineOfSight');
    computeLineOfSightGraphic(lineOfSight, entity, tileSize);

    const healthBar = container.getByName('healthBar');
    computeHealthBarGraphic(healthBar, entity, tileSize);

    return container;
  });

const renderUpdated = (scene, tileSize) => {
  const { gameData, renderData } = scene;
  const { entities } = renderData;
  const { player } = gameData.dungeon;
  const { enemies } = gameData.dungeon.currentLevel;

  updateEntities(scene, entities, enemies.concat([player]), tileSize);
};

export { renderInitial, renderUpdated };
