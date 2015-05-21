import Analytics from 'utils/Analytics';

import Boot from 'states/Boot';
import Preload from 'states/Preload';
import Menu from 'states/Menu';
import Game from 'states/Game';

var game, App = {};

App.start = function() {
    game = new Phaser.Game(
        960, 640,
        Phaser.AUTO,
        'game-container'
    );

    game.analytics = new Analytics('phaser-game');

    game.state.add('boot', Boot);
    game.state.add('preload', Preload);
    game.state.add('menu', Menu);
    game.state.add('game', Game);

    game.state.start('boot');

    return game;
};

export default App;
