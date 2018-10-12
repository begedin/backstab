import { Terrain } from 'backstab/enums';
import { pick as randomPick } from 'backstab/Random';

const buildTilemapConfig = (tileSize, mapSize) => ({
  tileWidth: tileSize,
  tileHeight: tileSize,
  width: mapSize,
  height: mapSize,
});

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

export default createDungeonTileMap;
