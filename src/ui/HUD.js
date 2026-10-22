import { styles } from "../game.js";

// yokais disponibles
const TOWERS = ["Alegría", "Fuego", "Planta", "Agua"]; // TODO: meter dentro de la clase?

export default class HUD {

  constructor(scene) {
    // barra superior
    scene.add.text(60, 30, "Volver", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("start"));

    // alegría
    this.joy = scene.add.text(150, 30, "Alegría: 0", styles.button).setOrigin(0, 0.5);

    // indicador oleada
    this.wave = scene.add.text(400, 30, "Oleada 1/5", styles.button).setOrigin(0.5);

    // boton para ir a resultado
    scene.add.text(750, 30, "Fin", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("result"));

    // templo
    scene.add.rectangle(10, 80, 140, 496).setOrigin(0).setStrokeStyle(1, 0xffffff);

    // las torres
    for (let i = 0; i < TOWERS.length; i++) {
      scene.add.rectangle(25, 100 + i * 95, 110, 85).setOrigin(0).setStrokeStyle(1, 0xffffff).setInteractive();
      scene.add.text(80, 142 + i * 95, TOWERS[i], styles.slot).setOrigin(0.5);
    }

    // botón de borrar
    scene.add.text(80, 100 + TOWERS.length * 95 + 40, "Borrar", styles.button).setOrigin(0.5).setInteractive();
  }
}
