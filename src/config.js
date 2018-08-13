import Boot from 'backstab/scenes/boot';
import Preload from 'backstab/scenes/preload';
import Game from 'backstab/scenes/game';

export default {
  TILE_SIZE: 32,
  BASE_SPEED: 300,
  width: 800,
  height: 600,
  backgroundColor: 'rgb(0, 0, 0)',
  scene: [Boot, Preload, Game],
};
