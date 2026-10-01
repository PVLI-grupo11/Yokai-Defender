import { styles } from "../game.js";

export default class Level extends Phaser.Scene {
  constructor() {
    super("level");
  }

  create() {
    this.add.text(400, 200, "Pantalla de nivel de juego", styles.title).setOrigin(0.5);
    this.add.text(400, 300, "Avanzar", styles.title).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("result"));
  }
}
