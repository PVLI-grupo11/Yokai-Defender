import { styles } from "../game.js";

export default class Start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  create() {
    this.add.text(400, 200, "Yokai Defender", styles.title).setOrigin(0.5);
    this.add.text(400, 300, "Jugar", styles.title).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("level"));
  }
}
