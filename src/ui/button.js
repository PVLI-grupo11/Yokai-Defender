import MenuScene from "../scenes/menuScene.js";

const COLOR = 0x9e2a2b;       // rojo del botón
const HOVER_COLOR = 0xc23b3a; // rojo más claro al pasar el ratón
const GOLD = 0xe8c170;        // borde, y relleno de la pestaña seleccionada

// botón: un rectángulo rojo con borde dorado y el texto encima
export default class Button {

  constructor(scene, x, y, text, onClick, width = 260) {
    this.selected = false; // para las pestañas

    this.box = scene.add.rectangle(x, y, width, 56, COLOR)
      .setStrokeStyle(2, GOLD)
      .setInteractive({ useHandCursor: true });

    this.label = scene.add.text(x, y, text, { fontFamily: MenuScene.FONT, fontSize: "26px", color: "#ffffff" })
      .setOrigin(0.5);

    this.box.on("pointerover", () => { if (!this.selected) this.box.setFillStyle(HOVER_COLOR); });
    this.box.on("pointerout", () => { if (!this.selected) this.box.setFillStyle(COLOR); });
    this.box.on("pointerdown", onClick);
  }

  setSelected(selected) {
    this.selected = selected;
    if (selected) {
      this.box.setFillStyle(GOLD);
      this.label.setColor("#3a0d10");
    } else {
      this.box.setFillStyle(COLOR);
      this.label.setColor("#ffffff");
    }
  }
}
