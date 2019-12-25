import Boot from '@/scenes/boot';
import Preload from '@/scenes/preload';
import DungeonLevel from '@/scenes/DungeonLevel';
import GameUI from '@/scenes/GameUI';

const config = {
  width: 800,
  height: 600,
  pixelArt: true,
  roundPixels: false,
  backgroundColor: 'rgb(0, 0, 0)',
  scene: [Boot, Preload, DungeonLevel, GameUI],
};

export default config;
