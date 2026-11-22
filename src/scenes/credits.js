import Button from "../ui/button.js";
import MenuScene from "./menuScene.js";

// pantalla de créditos
export default class Credits extends MenuScene {
  constructor() {
    super("credits");
  }

  create() {
    this.addBackground();
    this.addTitle(70, "Créditos");
    this.addPanel(170, 120, 460, 380);

    const gold = "#ffd23f";

    this.addText(400, 155, "Grupo 11 - PVLI", 22, gold, true).setOrigin(0.5);
    this.addText(400, 255, [
      "Adrián Arbas Perdiguero",
      "Tomás Arévalo Almagro",
      "Carlos Dochao Moreno",
      "Vicente Rodríguez Casado"
    ], 22).setOrigin(0.5);

    this.addText(400, 365, "Herramientas", 22, gold, true).setOrigin(0.5);
    this.addText(400, 420, ["Hecho con Phaser", "Imágenes provisionales generadas con IA"], 22).setOrigin(0.5);

    new Button(this, 400, 550, "Volver", () => this.scene.start("start"), 200);
  }
}
