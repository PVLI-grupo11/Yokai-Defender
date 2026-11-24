import { styles, configs } from "../game.js";
import Bullet from "./bullet.js";

// TODO: meter animaciones de cada yokai (dos frames para el idle,
// dos para disparar y dos para cuando muere)

// clase base de la que hereda cada tipo de yokai
export default class Yokai extends Phaser.GameObjects.Container {

  constructor(scene, x, y, texture, health, delay) {
    super(scene, x, y);

    this.health = health; // vida de dicho yokai
    this.delay = delay; // ms entre cada acción

    // texto con lo que devuelve al borrarlo, la mitad del coste (solo visible en modo borrado)
    this.refund = Math.floor(this.constructor.cost / 2);
    this.cashback = new Phaser.GameObjects.Text(scene, 0, -35, "+" + this.refund, styles.cashback_text)
      .setOrigin(0.5)
      .setVisible(false);

    // imagen y texto del yokai, se destruyen junto al contenedor
    this.add([new Phaser.GameObjects.Image(scene, 0, 0, texture), this.cashback]);
    scene.add.existing(this);
  }

  // al colocarlo empieza a actuar cada delay ms
  start() {
    const timer = this.scene.time.addEvent({ delay: this.delay, loop: true, callback: () => { if (this.canShoot()) this.shoot(); } });  // CAMBIADO: solo dispara si puede
    this.once("destroy", () => timer.remove()); // el temporizador es de la escena
  }

  // recibe daño y se destruye si se queda sin vida
  damage(damage) {
    this.health -= damage;
    if (this.health <= 0) this.destroy();
  }

//algún enemigo visible en su fila, por delante?
  canShoot() {
    return this.scene.hasEnemyAhead(this.row, this.x);
  }

  // disparo cada delay ms
  shoot() { }
}

// genera alegría
export class JoyYokai extends Yokai {
  static cost = 25;

  constructor(scene, x, y) { super(scene, x, y, "yokai-joy", 100, configs.JOY_DELAY); }

  canShoot() { return true; }  //la alegria se genera haya o no enemigos

  shoot() { this.scene.hud.sendJoy(this.x, this.y - 20, configs.JOY_VALUE); }  //la alegria vuela al HUD y se suma al llegar
}

// dispara fuego
export class FireYokai extends Yokai {
  static cost = 50;

  constructor(scene, x, y) { super(scene, x, y, "yokai-fire", 100, 1500); }

  shoot() { new Bullet(this.scene, this.x, this.y, 0xe4572e, 25, true); }  // atraviesa a los enemigos
}

// dispara planta
export class PlantYokai extends Yokai {
  static cost = 100;

  constructor(scene, x, y) { super(scene, x, y, "yokai-plant", 150, 1500); }

  shoot() { new Bullet(this.scene, this.x, this.y, 0x4caf50, 25); }
}

// dispara agua
export class WaterYokai extends Yokai {
  static cost = 150;

  constructor(scene, x, y) { super(scene, x, y, "yokai-water", 100, 1500); }

  shoot() { new Bullet(this.scene, this.x, this.y, 0x3f88c5, 25); }
}
