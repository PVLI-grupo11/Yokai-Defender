// Alegría que cae del cielo

const RADIUS = 15;          // tamaño del círculo
const FALL_SPEED = 60;      // píxeles por segundo al caer
const LIFETIME = 8000;      // ms que aguanta en el suelo antes de desaparecer

export default class Joy extends Phaser.GameObjects.Arc {

  constructor(scene, x, targetY, value, hud) {

    // nace justo por encima de la pantalla
    super(scene, x, -RADIUS, RADIUS, 0, 360, false, 0xffd23f);

    this.value = value;       // cuánta alegría da
    this.hud = hud;           // para saber a dónde volar y a quién sumar
    this.collected = false;   // evita recogerla dos veces
    this.expireTimer = null;

    this.setStrokeStyle(2, 0xffffff);
    this.setDepth(10);        // por encima de casillas y yokais
    scene.add.existing(this);

    // zona de interacción circular
    this.setInteractive(new Phaser.Geom.Circle(RADIUS, RADIUS, RADIUS), Phaser.Geom.Circle.Contains);
    this.on("pointerover", () => this.collect());

    // caída a velocidad constante
    scene.tweens.add({
      targets: this,
      y: targetY,
      duration: (targetY + RADIUS) / FALL_SPEED * 1000,
      onComplete: () => this.land()
    });
  }

  // se posa en el tablero
  land() {
    // latido para indicar que se puede recoger
    this.scene.tweens.add({
      targets: this,
      scale: 1.15,
      duration: 500,
      yoyo: true, // vuelve a 1
      repeat: -1 // infinito
    });

    // si nadie la recoge, desaparece
    this.expireTimer = this.scene.time.delayedCall(LIFETIME, () => this.expire());
  }

  // desaparece sin ser recogida
  expire() {
    this.disableInteractive();
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      onComplete: () => this.destroy()
    });
  }

  // recogida: pop y vuelo hasta el contador
  collect() {
    if (this.collected) return;
    this.collected = true;

    this.disableInteractive();
    this.scene.tweens.killTweensOf(this);           // para la caída o el latido
    if (this.expireTimer) this.expireTimer.remove(); // ya no caduca
    this.setScale(1); // por si estaba latiendo

    const target = this.hud.joyIcon;

    // 1) pop
    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      duration: 100,
      ease: "Back.easeOut", // rebote hacia fuera
      onComplete: () => {
        // 2) vuelo rápido hacia el icono
        this.scene.tweens.add({
          targets: this,
          x: target.x,
          y: target.y,
          scale: 0.5,
          duration: 400,
          ease: "Cubic.easeIn", // aceleración hacia dentro
          onComplete: () => {
            // 3) al llegar: suma y desaparece
            this.hud.addJoy(this.value);
            this.destroy();
          }
        });
      }
    });
  }
}