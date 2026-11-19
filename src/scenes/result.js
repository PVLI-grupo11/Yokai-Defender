import { styles } from "../game.js";

export default class Result extends Phaser.Scene {
  constructor() {
    super("result");
  }

  // data.win: true si se han superado todas las oleadas, false si se ha perdido
  init(data) {
    this.win = data.win;
  }

  create() {
    let title = "Resultado";
    if (this.win === true) title = "¡Victoria!";
    else if (this.win === false) title = "Derrota";
    this.add.text(400, 200, title, styles.title).setOrigin(0.5);
    this.add.text(400, 300, "Inicio", styles.title).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("start"));
  }
}
