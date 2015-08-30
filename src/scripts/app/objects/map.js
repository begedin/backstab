import Room from 'app/objects/room';

class Map extends Phaser.Group {
  constructor (game) {
    super(game);
    this.generate();
  }


  generate () {
    this.createInitialRoom();
  }


  createInitialRoom () {
    var initialRoom = new Room(this.game, 0, 0, 5, 5);
    this.add(initialRoom);
  }

}

export default Map
