import Phaser from 'phaser';
import { gridToWorld } from 'backstab/objects/grid/convert';

const ZOOM_LEVELS = [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2];

const zoomIn = camera => {
  const currentZoomIndex = ZOOM_LEVELS.indexOf(camera.zoom);
  if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
    camera.zoomTo(ZOOM_LEVELS[currentZoomIndex + 1], 250);
  }
};

const zoomOut = camera => {
  const currentZoomIndex = ZOOM_LEVELS.indexOf(camera.zoom);
  if (currentZoomIndex > 0) {
    camera.zoomTo(ZOOM_LEVELS[currentZoomIndex - 1], 250);
  }
};

const scrollCamera = (camera, { x, y }) => {
  camera.stopFollow();
  camera.setScroll(camera.scrollX - x, camera.scrollY - y);
};

const setupCamera = (camera, tileSize, mapSize, { x, y }) => {
  const worldSize = tileSize * mapSize;
  camera.setBounds(0, 0, worldSize, worldSize);
  camera.setRoundPixels(true);
  camera.setScroll(gridToWorld(x), gridToWorld(y));
  camera.setZoom(1);
};

const buildControlConfig = (camera, keyboard) => ({
  camera,
  speed: 0.5,
  disableCull: true,
  zoomIn: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
  zoomOut: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
});

class CameraController extends Phaser.Events.EventEmitter {
  constructor(camera, input) {
    super();

    const { keyboard } = input;
    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    window.addEventListener(
      'wheel',
      ({ deltaY }) => {
        if (deltaY > 0) {
          this.emit('zoomIn');
        }

        if (deltaY < 0) {
          this.emit('zoomOut');
        }
      },
      false,
    );

    this.input = input;
    this.on('zoomIn', () => zoomIn(camera));
    this.on('zoomOut', () => zoomOut(camera));
    this.on('drag', amount => scrollCamera(camera, amount));
  }

  update(delta) {
    this.controls.update(delta);

    const { activePointer } = this.input;

    if (activePointer.isDown) {
      if (this.origDragPoint) {
        const { x: startX, y: startY } = this.origDragPoint;
        const { x: dragX, y: dragY } = activePointer.position;

        const newScrollX = dragX - startX;
        const newScrollY = dragY - startY;

        this.emit('drag', { x: newScrollX, y: newScrollY });
      }

      this.origDragPoint = activePointer.position.clone();
    } else {
      delete this.origDragPoint;
    }
  }
}

export default CameraController;
export { zoomIn, zoomOut, scrollCamera, setupCamera };
