import Button from "../ui/button.js";
import MenuScene from "./menuScene.js";
import * as Yokais from "../objects/yokais.js"; // todas las clases de yokais: Yokais.JoyYokai, Yokais.FireYokai...

// fichas de la enciclopedia: imagen, nombre y descripción 
const YOKAIS = [
  { image: "yokai-joy", name: "Yokai Alegría", text: "Coste: " + Yokais.JoyYokai.cost + "  ·  Vida: 100\nNo ataca, pero genera 25 de alegría cada 6 segundos. Mejor ponerlo atrás, cerca del templo." },
  { image: "yokai-fire", name: "Yokai de Fuego", text: "Coste: " + Yokais.FireYokai.cost + "  ·  Vida: 100\nDispara bolas de fuego que atraviesan a todos los enemigos de su carril." },
  { image: "yokai-plant", name: "Yokai de Planta", text: "Coste: " + Yokais.PlantYokai.cost + "  ·  Vida: 150\nEl más resistente. Sus disparos golpean al primer enemigo que encuentran." },
  { image: "yokai-water", name: "Yokai de Agua", text: "Coste: " + Yokais.WaterYokai.cost + "  ·  Vida: 100\nLanza chorros de agua que golpean al primer enemigo del carril." },
];

const ENEMIES = [
  { image: "enemy-fire", name: "Espíritu de Fuego", text: "Vida: 100  ·  Velocidad: muy rápida\nCorre por el carril y llega antes que nadie a tus defensas." },
  { image: "enemy-plant", name: "Espíritu de Planta", text: "Vida: 100  ·  Velocidad: lenta\nAvanza despacio, pero no deja de avanzar." },
  { image: "enemy-water", name: "Espíritu de Agua", text: "Vida: 200  ·  Velocidad: muy lenta\nEl más duro del ejército de la Desesperación: aguanta el doble de golpes." },
];

const ROW_START = 200; // y de la primera ficha
const ROW_HEIGHT = 95; // distancia entre fichas

// enciclopedia con dos páginas
export default class Encyclopedia extends MenuScene {
  constructor() {
    super("encyclopedia");
  }

  create() {
    this.addBackground();
    this.addTitle(50, "Enciclopedia");
    this.addPanel(40, 150, 720, 385);

    this.yokaiPage = this.createPage(YOKAIS);
    this.enemyPage = this.createPage(ENEMIES);

    // pestañas para cambiar de página
    this.yokaiTab = new Button(this, 305, 112, "Yokais", () => this.showPage(true), 180);
    this.enemyTab = new Button(this, 495, 112, "Enemigos", () => this.showPage(false), 180);

    new Button(this, 400, 568, "Volver", () => this.scene.start("start"), 180);

    this.showPage(true);
  }

  // crea una ficha por cada elemento de la lista, una debajo de otra
  createPage(entries) {
    const page = this.add.container(0, 0);

    for (let i = 0; i < entries.length; i++) {
      const y = ROW_START + i * ROW_HEIGHT;
      const entry = entries[i];

      // círculo detrás de la imagen
      const frame = this.add.circle(105, y, 40, 0x2d1838).setStrokeStyle(2, 0xe8c170);
      const image = this.add.image(105, y, entry.image);
      image.setScale(64 / image.height); // todas las imágenes a 64 px de alto
      const name = this.addText(165, y - 38, entry.name, 24, "#ffd23f", true);
      const text = this.addText(165, y - 8, entry.text, 16).setAlign("left").setWordWrapWidth(560);

      page.add([frame, image, name, text]);
    }
    return page;
  }

  // muestra la página de yokais si es true o la de enemigos si es false
  showPage(showYokais) {
    this.yokaiPage.setVisible(showYokais);
    this.enemyPage.setVisible(!showYokais);

    // la pestaña activa se queda iluminada
    this.yokaiTab.setSelected(showYokais);
    this.enemyTab.setSelected(!showYokais);
  }
}
