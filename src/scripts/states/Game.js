import Phaser from "phaser";

class Game extends Phaser.Scene {
    constructor() {
        super({ key: "Game" });
    }

    create() {
        console.log("Hello Game!");

        // Add game title
        this.add
            .text(480, 50, "GAME SCENE", {
                fontSize: "32px",
                fill: "#fff",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Add a simple game area
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(100, 100, 760, 440);

        // Add some placeholder text
        this.add
            .text(480, 320, "Game content will go here", {
                fontSize: "24px",
                fill: "#ccc",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        this.add
            .text(480, 360, "Click to return to menu", {
                fontSize: "18px",
                fill: "#888",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Add click handler to return to menu
        this.input.on("pointerdown", () => {
            this.scene.start("Menu");
        });
    }
}

export default Game;
