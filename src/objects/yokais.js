import { styles, configs } from "../game.js";
import Bullet from "./bullet.js";

// TODO: meter animaciones de cada yokai (dos frames para el idle,
// dos para disparar y dos para cuando muere)

const MAX_UPGRADES = 5;     // veces que se puede mejorar un yokai
const UPGRADE_MULT = 1.25;  // cada mejora multiplica el daño o la velocidad de disparo
const BASE_DAMAGE = 25;     // daño de cada bala sin mejoras

// clase base de la que hereda cada tipo de yokai
export default class Yokai extends Phaser.GameObjects.Container {

  constructor(scene, x, y, texture, health, delay) {
    super(scene, x, y);

    this.health = health; // vida de dicho yokai
    this.delay = delay; // ms entre cada acción

    this.branch = null; // mejora elegida: "speed", "damage" o null si no tiene
    this.level = 0; // veces que se ha mejorado
    this.damageMult = 1; // multiplicador del daño de sus balas

    // texto con el nivel de mejora, debajo del yokai
    this.levelText = new Phaser.GameObjects.Text(scene, 0, 40, "", styles.level_text).setOrigin(0.5);

    // texto con lo que devuelve al borrarlo, la mitad del coste (solo visible en modo borrado)
    this.refund = Math.floor(this.constructor.cost / 2);
    this.cashback = new Phaser.GameObjects.Text(scene, 0, -35, "+" + this.refund, styles.cashback_text)
      .setOrigin(0.5)
      .setVisible(false);

    // imagen y texto del yokai, se destruyen junto al contenedor
    this.add([new Phaser.GameObjects.Image(scene, 0, 0, texture), this.cashback, this.levelText]);
    scene.add.existing(this);
  }

  // al colocarlo empieza a actuar cada delay ms
  start() {
    this.timer = this.scene.time.addEvent({ delay: this.delay, loop: true, callback: () => { if (this.canShoot()) this.shoot(); } });  // CAMBIADO: solo dispara si puede
    this.once("destroy", () => this.timer.remove()); // el temporizador es de la escena
  }

  // la primera mejora cuesta la mitad del yokai y cada una el doble que la anterior
  upgradeCost() {
    return Math.floor(this.constructor.cost / 2) * Math.pow(2, this.level);
  }

  // se puede mejorar si no está al máximo y es su rama
  canUpgrade(branch) {
    return this.level < MAX_UPGRADES && (this.branch === null || this.branch === branch);
  }

  // subir nivel
  upgrade(branch) {
    this.branch = branch;
    this.level++;
    if (branch === "speed") {
      this.delay /= UPGRADE_MULT;
      this.timer.delay = this.delay; // el temporizador usa el nuevo tiempo desde el siguiente disparo
      this.levelText.setText("Vel " + this.level);
    }
    else {
      this.damageMult *= UPGRADE_MULT;
      this.levelText.setText("Daño " + this.level);
    }
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

  shoot() { new Bullet(this.scene, this.x, this.y, 0xe4572e, BASE_DAMAGE * this.damageMult, "fire", true); }  // atraviesa a los enemigos
}

// dispara planta
export class PlantYokai extends Yokai {
  static cost = 100;

  constructor(scene, x, y) { super(scene, x, y, "yokai-plant", 150, 1500); }

  shoot() { new Bullet(this.scene, this.x, this.y, 0x4caf50, BASE_DAMAGE * this.damageMult, "plant"); }
}

// dispara agua
export class WaterYokai extends Yokai {
  static cost = 150;

  constructor(scene, x, y) { super(scene, x, y, "yokai-water", 100, 1500); }

  shoot() { new Bullet(this.scene, this.x, this.y, 0x3f88c5, BASE_DAMAGE * this.damageMult, "water"); }
}
