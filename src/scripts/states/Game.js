import Map from 'entities/map';

class Game {

    create() {
        this.map = new Map(this);
    }

}

export default Game;
