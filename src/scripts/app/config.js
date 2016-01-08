var config = {
  GAME_WIDTH: 1024,
  GAME_HEIGHT: 600,
	DESIRED_TILE_SIZE: 20,
  ACTUAL_TILE_SIZE: 32,
  MAP_SIZE: 64,
  BASE_SPEED: 100
}

config.SCALE = config.DESIRED_TILE_SIZE / config.ACTUAL_TILE_SIZE;
config.WORLD_BOUND_X = config.MAP_SIZE * config.DESIRED_TILE_SIZE;
config.WORLD_BOUND_Y = config.MAP_SIZE * config.DESIRED_TILE_SIZE;

export default config;
