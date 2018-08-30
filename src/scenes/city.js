import Phaser from 'phaser';

const buildControlConfig = (camera, keyboard) => ({
  camera,
  speed: 0.5,
  disableCull: true,
  zoomIn: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
  zoomOut: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
});

const setupMouseScrollControl = camera => {
  window.addEventListener(
    'wheel',
    ({ deltaY }) => {
      const zoomIn = 1.5;
      const zoomOut = 1 / zoomIn;

      if (deltaY > 0) {
        camera.zoomTo(camera.zoom * zoomOut, 250);
      } else {
        camera.zoomTo(camera.zoom * zoomIn, 250);
      }
    },
    false,
  );
};

const loadCity = (scene, cityMap, { buildings: buildingData }) =>
  buildingData.map(vertices => {
    const graphics = scene.add.graphics();
    graphics.lineStyle(5, 0x000000, 5);
    graphics.fillStyle(0xff700b, 1);
    graphics.beginPath();
    vertices.forEach(({ x: vx, y: vy }) => graphics.lineTo(vx, vy));
    graphics.closePath();
    graphics.fillPath();
    const coords = vertices
      .map(({ x, y }) => [x, y])
      .reduce((a, b) => a.concat(b), []);
    const shape = new Phaser.Geom.Polygon(coords);
    graphics.setInteractive(shape, Phaser.Geom.Polygon.Contains);

    return graphics;
  });

export default class City extends Phaser.Scene {
  constructor() {
    super('city');
  }

  create() {
    const cityMap = this.add.sprite(0, 0, 'city');
    cityMap.setOrigin(0, 0);
    const cityData = this.cache.json.get('city-data');

    const buildings = loadCity(this, cityMap, cityData);
    this.buildings = this.add.group();
    this.buildings.addMultiple(buildings);

    const building = this.buildings.children.entries[0];
    building.on(
      'pointerdown',
      () => {
        this.scene.start('game');
      },
      building,
    );

    building.on(
      'pointerover',
      () => {
        building.fillStyle(0x0007ff, 1);
        building.fillPath();
      },
      building,
    );

    building.on(
      'pointerout',
      () => {
        building.fillStyle(0xff700b, 1);
        building.fillPath();
      },
      building,
    );

    const { main: camera } = this.cameras;
    const { keyboard } = this.input;

    const controlConfig = buildControlConfig(camera, keyboard);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    setupMouseScrollControl(camera);
  }

  update(delta) {
    this.handleDrag();
    this.controls.update(delta);
  }

  handleDrag() {
    const { activePointer } = this.input;

    if (activePointer.isDown) {
      this.cameras.main.stopFollow();

      if (this.origDragPoint) {
        const { scrollX, scrollY } = this.cameras.main;
        const { x: startX, y: startY } = this.origDragPoint;
        const { x: dragX, y: dragY } = activePointer.position;

        const newScrollX = scrollX - (dragX - startX);
        const newScrollY = scrollY - (dragY - startY);

        this.cameras.main.setScroll(newScrollX, newScrollY);
      }
      this.origDragPoint = activePointer.position.clone();
    } else {
      delete this.origDragPoint;
    }
  }
}
