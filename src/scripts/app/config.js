var config = {
	DESIRED_TILE_SIZE: 64,
  ACTUAL_TILE_SIZE: 32,
  MAP_SIZE: 64
}

config.SCALE = config.DESIRED_TILE_SIZE / config.ACTUAL_TILE_SIZE;
config.WORLD_BOUND_X = config.MAP_SIZE * config.DESIRED_TILE_SIZE;
config.WORLD_BOUND_Y = config.MAP_SIZE * config.DESIRED_TILE_SIZE;

export default config;