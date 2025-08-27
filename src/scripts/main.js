import Phaser from "phaser";
import Analytics from "./utils/Analytics.js";

import Boot from "./states/Boot.js";
import Preload from "./states/Preload.js";
import Menu from "./states/Menu.js";
import Game from "./states/Game.js";

let game;

const App = {
    start: () => {
        const config = {
            type: Phaser.AUTO,
            width: 960,
            height: 640,
            parent: "game-container",
            scene: [Boot, Preload, Menu, Game],
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 300 },
                    debug: false,
                },
            },
        };

        game = new Phaser.Game(config);

        // Add analytics to the game instance
        game.analytics = new Analytics("phaser-game");

        return game;
    },
};

// Start the game when the module is loaded
window.game = App.start();

export default App;
