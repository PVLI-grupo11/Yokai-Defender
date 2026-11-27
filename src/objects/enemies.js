import { styles } from "../game.js";
// TODO: meter animaciones de cada enemigo (dos frames para el avance,
// dos para "comer" o destruir yokai y dos para cuando muere)

// barra de vida
const BAR_WIDTH = 40;
const BAR_HEIGHT = 5;

const FLASH_TIME = 80; //ms que el enemigo se queda en blanco al recibir daño

//lo que multiplica cada cosa
const DAMAGEPELEMENT = {
  fire:  { fire: 1,   plant: 1.5, water: 0.5 }, 
  water: { fire: 1.5, plant: 0.5, water: 1 },   
  plant: { fire: 0.5, plant: 1,   water: 1.5 },  
};

export default class Enemy extends Phaser.GameObjects.Sprite {

  constructor(scene, row, type, health, speed) {
    const { y } = scene.getGridPos(row, 0);     // la y de su fila
    super(scene, scene.scale.width + 40, y, "enemy-" + type);    //nace fuera a la derecha, en la fila que le toca

    this.row = row;           //fila en la que está (para que los yokais lo detecten)
    this.health = health;
    this.maxHealth = health;  //para calcular cuanto ocupa la barra
    this.speed = speed;
    this.element = type;      //fire, water o plant (para saber cuanto daño le hace cada bala)
    this.flashTimer = null;   //temporizador del parpadeo

    scene.add.existing(this);
    scene.enemies.add(this);
    this.body.setSize(48, 60);
    this.body.setVelocityX(-speed);

    this.createHealthBar();
  }

   //ha empezado a entrar en la pantalla (el enemigo es visible)
  isOnScreen() {
    return this.x - this.displayWidth / 2 < this.scene.scale.width;
  }

  //la barra sigue al enemigo
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.positionHealthBar();
  }

  //multiplica la vida 
  multiplyHealth(factor) {
    this.health *= factor;
    this.maxHealth *= factor;  //la barra de vida sigue empezando llena
  }

//recibe daño
  damage(damage, element) {
    if (!this.active) return; //ya estaba muerto

    damage *= DAMAGEPELEMENT[element][this.element];
    this.health -= damage;
    this.onDamaged(damage);   //feedback visual


    if (this.health <= 0) this.die();
  }

  //todo el feedback visual al recibir daño
  onDamaged(damage) {
    this.updateHealthBar();
    this.showDamageNumber(damage);
    this.flash();
    this.shake();
  }

  // muere (aquí irá la animación de muerte)
  die() {
    this.destroy();
  }


   // barra vida

  // crea la barra (oculta hasta el primer golpe)
  createHealthBar() {
    // fondo negro, un poco más grande para que haga de borde
    this.barBg = this.scene.add.rectangle(0, 0, BAR_WIDTH + 2, BAR_HEIGHT + 2, 0x000000)
      .setDepth(5)
      .setVisible(false);

    // relleno, con origen a la izquierda para que se vacíe de derecha a izquierda
    this.barFill = this.scene.add.rectangle(0, 0, BAR_WIDTH, BAR_HEIGHT, 0x4caf50)
      .setOrigin(0, 0.5) // origen a la izquierda
      .setDepth(5)
      .setVisible(false);

    this.positionHealthBar();

    // la barra no es parte del sprite: hay que destruirla a mano cuando muere
    this.once("destroy", () => {
      this.barBg.destroy();
      this.barFill.destroy();
    });
  }

  // coloca la barra encima del enemigo
  positionHealthBar() {
    const top = this.y - this.displayHeight / 2 - 8;
    this.barBg.setPosition(this.x, top);
    this.barFill.setPosition(this.x - BAR_WIDTH / 2, top);
  }

  // ajusta el tamaño y el color de la barra a la vida que queda
  updateHealthBar() {
    const ratio = Math.max(this.health, 0) / this.maxHealth;  // entre 0 y 1

    this.barFill.scaleX = ratio;
    if (ratio > 0.5) this.barFill.setFillStyle(0x4caf50);        // verde
    else if (ratio > 0.25) this.barFill.setFillStyle(0xffd23f);  // amarillo
    else this.barFill.setFillStyle(0xe4572e);                    // rojo

    this.barBg.setVisible(true);
    this.barFill.setVisible(true);
  }

   // -----------numero de daño-----------------------------------------------------------------------------------------------

  // número que sube y desaparece al recibir daño
  showDamageNumber(damage) {
    const x = this.x + Phaser.Math.Between(-12, 12);  // un poco de variación para que no se solapen
    const y = this.y - this.displayHeight / 2 - 20;   // por encima de la barra

    const text = this.scene.add.text(x, y, String(Math.round(damage)), styles.damage_text)
      .setOrigin(0.5)
      .setDepth(20);

    this.scene.tweens.add({
      targets: text,
      y: y - 40,
      alpha: 0,
      duration: 700,
      ease: "Cubic.easeOut",
      onComplete: () => text.destroy()
    });
  }

   // -----------parpadeo-----------------------------------------------------------------------------------------------

  // el sprite se pone completamente blanco un instante
  flash() {
    this.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);

    if (this.flashTimer) this.flashTimer.remove();  // si ya estaba parpadeando, reinicia el tiempo
    this.flashTimer = this.scene.time.delayedCall(FLASH_TIME, () => {
      if (this.active) this.clearTint();
    });
  }

    // -----------temblor-----------------------------------------------------------------------------------------------

  // el sprite se balancea rápido a izquierda y derecha
  shake() {
    this.scene.tweens.killTweensOf(this);  // si ya estaba temblando, empieza de nuevo
    this.setAngle(0);

    this.scene.tweens.add({
      targets: this,
      angle: { from: -6, to: 6 },  // grados de inclinación a cada lado
      duration: 40,                // ms de cada balanceo
      yoyo: true,
      repeat: 2,
      onComplete: () => this.setAngle(0)  // termina recto
    });
  }

}

export class FireEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "fire", 100, 60); }
}

export class PlantEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "plant", 100, 20); }
}

export class WaterEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "water", 200, 15); }
}