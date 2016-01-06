import config from 'app/config';
import GridSprite from 'app/objects/grid_sprite';

class Player extends GridSprite {
	constructor (game, dungeon, gridX, gridY) {
		super(game, gridX, gridY, 'player');
    this.dungeon = dungeon;
    this.cursors = game.input.keyboard.createCursorKeys();
	}

  update () {
    this.handleMovement();
  }

  handleMovement() {
    if (this.cursors.up.isDown && this.canMoveUp) {
      this.moveUp();
    } else if (this.cursors.right.isDown && this.canMoveRight) {
      this.moveRight();
    } else if (this.cursors.down.isDown && this.canMoveDown) {
      this.moveDown();
    } else if (this.cursors.left.isDown && this.canMoveLeft) {
      this.moveLeft();
    }
  }

  get canMoveUp() {
    return (this.gridY > 1) && this.dungeon.tileAt(this.gridX, this.gridY - 1).isWalkable;
  }

  get canMoveDown() {
    return (this.gridY < config.MAP_SIZE - 1) && this.dungeon.tileAt(this.gridX, this.gridY + 1).isWalkable
  }

  get canMoveRight() {
    return (this.gridX < config.MAP_SIZE - 1) && this.dungeon.tileAt(this.gridX + 1, this.gridY).isWalkable;
  }

  get canMoveLeft() {
    return (this.gridX > 1) && this.dungeon.tileAt(this.gridX - 1, this.gridY).isWalkable;
  }

  moveUp() {
    this.gridY--;
  }

  moveDown() {
    this.gridY++;
  }

  moveLeft() {
    this.gridX--;
  }

  moveRight() {
    this.gridX++;
  }
}

export default Player;