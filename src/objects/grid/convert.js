import globals from 'backstab/globals';

const { TILE_SIZE } = globals;

const gridToWorld = x => x * TILE_SIZE + Math.floor(TILE_SIZE / 2);

// eslint-disable-next-line import/prefer-default-export
export { gridToWorld };
