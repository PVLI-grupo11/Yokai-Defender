// clase prov de los yokais (habrá que cambiarlo)
import { styles } from "../game.js";

// alegría que se genera sola (la del nivel y la de cada yokai de alegría)
export const JOY_DELAY = 3000;   // ms entre cada generación
export const JOY_VALUE = 25;     // alegría que se suma cada vez

// clase base de la que hereda cada tipo de yokai
export default class Yokai extends Phaser.GameObjects.Container {
  
  constructor(scene, x, y, texture, cost, health, delay) {
    super(scene, x, y);

    this.cost = cost;
    this.health = health;
    this.delay = delay;  // ms entre cada acción (undefined = no hace nada)

    // texto con lo que devuelve al borrarlo, la mitad del coste (solo visible en modo borrado)
    this.cashbackText = new Phaser.GameObjects.Text(scene, 0, -35, "+" + Math.floor(cost / 2), styles.slot).setOrigin(0.5)
      .setColor("#ffd23f")
      .setVisible(false);

    // placeholder del yokai + su texto (se destruyen junto al contenedor)
    this.add([
      new Phaser.GameObjects.Image(scene, 0, 0, texture),
      this.cashbackText
    ]);
    scene.add.existing(this);
  }

  // al colocarlo en el tablero empieza a hacer su acción cada delay ms (si tiene)
  start() {
    if (!this.delay) return;

    const timer = this.scene.time.addEvent({ delay: this.delay, loop: true, callback: () => this.act() });
    this.once("destroy", () => timer.remove());
  }

  // acción periódica de cada tipo de yokai
  act() {}
}

// genera alegría
export class JoyYokai extends Yokai {
  constructor(scene, x, y) { super(scene, x, y, "yokai-joy", 50, 100, JOY_DELAY); }

  act() { this.scene.hud.addJoy(JOY_VALUE); }
}

// dispara fuego
export class FireYokai extends Yokai {
  constructor(scene, x, y) { super(scene, x, y, "yokai-fire", 100, 100, 1500); }

  act() { /* TODO: disparar */ }
}

// aguanta golpes (no hace nada)
export class PlantYokai extends Yokai {
  constructor(scene, x, y) { super(scene, x, y, "yokai-plant", 75, 150); }
}

// dispara agua
export class WaterYokai extends Yokai {
  constructor(scene, x, y) { super(scene, x, y, "yokai-water", 100, 100, 1500); }

  act() { /* TODO: disparar */ }
}
