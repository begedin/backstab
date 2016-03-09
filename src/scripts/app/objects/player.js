import GridSprite from 'app/objects/grid_sprite';

class Player extends GridSprite {
	constructor (game, dungeon, gridX, gridY) {
		super(game, gridX, gridY, 'player');
    this.dungeon = dungeon;
    this.cursors = game.input.keyboard.createCursorKeys();
	}

  update () {
    if (!this.isMoving) {
      this.handleMovement();
    }
  }

  handleMovement() {
    if (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) {
      this.game.camera.follow(this, Phaser.Camera.FOLLOW_TOPDOWN);
    }
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
    let tile = this.dungeon.tileAt(this.gridX, this.gridY - 1);
    return tile && tile.isWalkable;
  }

  get canMoveDown() {
    let tile = this.dungeon.tileAt(this.gridX, this.gridY + 1);
    return tile && tile.isWalkable;
  }

  get canMoveRight() {
    let tile = this.dungeon.tileAt(this.gridX + 1, this.gridY);
    return tile && tile.isWalkable;
  }

  get canMoveLeft() {
    let tile = this.dungeon.tileAt(this.gridX - 1, this.gridY);
    return tile && tile.isWalkable;
  }
}

export default Player;
