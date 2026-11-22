import Button from "../ui/button.js";
import MenuScene from "./menuScene.js";

// menú principal
export default class Start extends MenuScene {
  constructor() {
    super("start");
  }

  // el menú es la primera escena, así que aquí se cargan todas las imágenes del juego
  preload() {
    this.load.svg("background", "assets/background.svg");
    this.load.svg("menu-background", "assets/menu_background.svg");

    // Yokais
    this.load.svg("yokai-joy", "assets/sprites/yokais/joy_yokai.svg");
    this.load.svg("yokai-fire", "assets/sprites/yokais/fire_yokai.svg");
    this.load.svg("yokai-plant", "assets/sprites/yokais/plant_yokai.svg");
    this.load.svg("yokai-water", "assets/sprites/yokais/water_yokai.svg");

    // Enemigos
    this.load.svg("enemy-fire", "assets/sprites/enemies/fire_enemy.svg");
    this.load.svg("enemy-water", "assets/sprites/enemies/water_enemy.svg");
    this.load.svg("enemy-plant", "assets/sprites/enemies/plant_enemy.svg");
  }

  create() {
    this.addBackground();

    const title = this.addTitle(150, "Yokai Defender", 64);
    this.addText(400, 205, "妖怪ディフェンダー", 22, "#ffd6e5").setOrigin(0.5);

    // el título flota arriba y abajo sin parar
    this.tweens.add({ targets: title, y: 140, duration: 2000, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    new Button(this, 400, 300, "Jugar", () => this.scene.start("level"));
    new Button(this, 400, 375, "Enciclopedia", () => this.scene.start("encyclopedia"));
    new Button(this, 400, 450, "Créditos", () => this.scene.start("credits"));
  }
}
