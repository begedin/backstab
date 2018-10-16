import Boot from 'backstab/scenes/boot';
import Preload from 'backstab/scenes/preload';
import Game from 'backstab/scenes/game';
import GameUI from 'backstab/scenes/gameUI';
import City from 'backstab/scenes/city';

export default {
  width: 800,
  height: 600,
  pixelArt: true,
  roundPixels: false,
  backgroundColor: 'rgb(0, 0, 0)',
  scene: [Boot, Preload, Game, GameUI, City],
};