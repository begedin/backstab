import Phaser from "phaser";

class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "Menu" });
    }

    create() {
        // Add title
        this.add
            .text(480, 200, "BACKSTAB", {
                fontSize: "64px",
                fill: "#fff",
                fontFamily: "Arial",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        this.add
            .text(480, 280, "A Stealth Puzzler", {
                fontSize: "24px",
                fill: "#ccc",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Add clickable start button
        const startButton = this.add
            .text(480, 400, "CLICK TO START", {
                fontSize: "32px",
                fill: "#0f0",
                fontFamily: "Arial",
                backgroundColor: "#333",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5);

        // Make button interactive
        startButton.setInteractive({ useHandCursor: true });

        // Add hover effects
        startButton.on("pointerover", () => {
            startButton.setStyle({ fill: "#0ff" });
        });

        startButton.on("pointerout", () => {
            startButton.setStyle({ fill: "#0f0" });
        });

        // Handle click
        this.input.on("pointerdown", this.startGame, this);
    }

    startGame() {
        this.scene.start("Game");
    }
}

export default Menu;
