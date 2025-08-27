import Phaser from "phaser";

class Preload extends Phaser.Scene {
    constructor() {
        super({ key: "Preload" });
    }

    preload() {
        // Show the preloader here (example preloader sprite below)
        /*
        this.loadingSprite = this.add.sprite(320, 480, 'preloader');
        this.loadingSprite.setOrigin(0.5, 0.5);
        this.load.on('progress', (value) => {
            this.loadingSprite.setScale(value, 1);
        });
         */
        // Load game assets here (example below)
        /*
        this.load.image('logo', '/img/logo.png');
         */
    }

    create() {
        // Add visual feedback
        this.add
            .text(480, 280, "LOADING...", {
                fontSize: "48px",
                fill: "#fff",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        this.add
            .text(480, 360, "Assets are being prepared", {
                fontSize: "24px",
                fill: "#ccc",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // (optionally) show the splash page or menu when the load completes
        this.time.delayedCall(2000, () => {
            this.scene.start("Menu");
        });
    }
}

export default Preload;
