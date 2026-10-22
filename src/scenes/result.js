import { styles } from "../game.js";

export default class Result extends Phaser.Scene {
  constructor() {
    super("result");
  }

  create() {
    this.add.text(400, 200, "Resultado", styles.title).setOrigin(0.5);
    this.add.text(400, 300, "Inicio", styles.title).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("start"));
  }
}
