/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */

import assets from '../data/assets';
import DungeonGenerator from 'app/objects/dungeon/generator';
import Player from 'app/objects/player';


export default class Game extends Phaser.State {

  init() {
    // Point the Phaser Asset Loader to where all your assets live.
    this.load.baseURL = './assets/';
    this.stage.backgroundColor = '#fffff';
  }

  preload() {
    this.load.pack('game', null, assets);
  }

  create() {
    this.game.world.setBounds(0, 0, 2000, 2000);

    this.dungeon = new DungeonGenerator(this.game);
    this.loadDungeon(this.dungeon);
    this.player = this.createPlayer(this.dungeon);

    this.game.camera.position.setTo(this.player.position);
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    var context = this;
    this.game.input.mouse.mouseWheelCallback = function(mouseEvent) {
      context.handleMouseWheel(mouseEvent);
    };
  }

  loadDungeon(dungeon) {
    let tiles = new Phaser.Group(this.game);
    dungeon.flattenedTiles.forEach((tile) => {
      tiles.add(tile);
    });
  }

  createPlayer(dungeon) {
    this.actors = new Phaser.Group(this.game);
    let playerPosition = dungeon.startingLocation;
    let player = new Player(this.game, dungeon, playerPosition.x, playerPosition.y);
    this.actors.add(player);
    return player;
  }

  update() {
    this.handlePlusMinus();
    this.handleDrag();
  }

  changeZoom(amount) {
    let maxScale = 5;
    let minScale = 0.2;
    let currentScale = this.game.camera.scale.x;
    let newScale = currentScale + amount;
    if (newScale > maxScale) {
      newScale = maxScale;
    } else if (newScale < minScale) {
      newScale = minScale;
    }

    if (currentScale !== newScale) {
      this.game.camera.scale.setTo(newScale, newScale);
    }
  }


  handleMouseWheel() {
    var delta = this.game.input.mouse.wheelDelta;
    this.changeZoom(delta * 0.2);
  }

  handlePlusMinus() {
    if (this.game.input.keyboard.isDown(Phaser.KeyCode.PLUS) || this.game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_ADD)) {
      this.changeZoom(0.02);
    } else if (this.game.input.keyboard.isDown(Phaser.KeyCode.MINUS) || this.game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_SUBTRACT)) {
      this.changeZoom(-0.02);
    }
  }

  handleDrag() {
    if (this.game.input.activePointer.isDown) {
      this.game.camera.unfollow();
      if (this.game.origDragPoint) {
        // move the camera by the amount the mouse has moved since last update
        this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
        this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
      }
      // set new drag origin to current position
      this.game.origDragPoint = this.game.input.activePointer.position.clone();
    } else {
      this.game.origDragPoint = null;
    }
  }
}
