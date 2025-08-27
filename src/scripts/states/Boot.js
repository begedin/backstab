import Phaser from "phaser";

class Boot extends Phaser.Scene {
    constructor() {
        super({ key: "Boot" });
    }

    preload() {
        // Load the assets for the preload state here
    }

    create() {
        // Configure input
        this.input.maxPointers = 1;

        // Auto pause if window loses focus
        this.game.scale.pauseOnBlur = true;

        // Configure scaling
        this.scale.setGameSize(960, 640);
        this.scale.setZoom(1);

        if (this.game.device.desktop) {
            this.scale.pageAlignHorizontally = true;
        }

        // Add some visual feedback
        this.add
            .text(480, 320, "BOOT SCENE", {
                fontSize: "32px",
                fill: "#fff",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Start the preload scene after a short delay
        this.time.delayedCall(2000, () => {
            this.scene.start("Preload");
        });
    }
}

export default Boot;
