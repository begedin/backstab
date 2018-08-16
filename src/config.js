import Boot from 'backstab/scenes/boot';
import Preload from 'backstab/scenes/preload';
import Game from 'backstab/scenes/game';

export default {
  width: 800,
  height: 600,
  pixelArt: true,
  roundPixels: false,
  backgroundColor: 'rgb(0, 0, 0)',
  scene: [Boot, Preload, Game],
};
