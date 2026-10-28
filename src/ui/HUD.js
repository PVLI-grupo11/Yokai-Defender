import { styles } from "../game.js";
import { YOKAIS } from "../data/yokais.js";

export default class HUD {

  constructor(scene) {

    this.scene = scene;        //para poder crear tweens desde addJoy
    this.joyAmount = 0;        //alegría acumulada

    this.selected = null;      // datos del yokai seleccionado (o null si no hay)
    this.selectedSlot = null;  // rectángulo del hueco resaltado
    this.erasing = false;      // true = modo borrado activo
    this.slots = [];          //huecos del selector (para actualizar si se pueden pagar)


    // barra superior
    scene.add.text(60, 30, "Volver", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("start"));

    // alegría
   this.joyIcon = scene.add.circle(140, 30, 10, 0xffd23f).setStrokeStyle(1, 0xffffff);  
   this.joy = scene.add.text(158, 30, "Alegría: 0", styles.button).setOrigin(0, 0.5);

    // indicador oleada
    this.wave = scene.add.text(400, 30, "Oleada 1/5", styles.button).setOrigin(0.5);

    // boton para ir a resultado
    scene.add.text(750, 30, "Fin", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("result"));

    // templo
    scene.add.rectangle(10, 80, 140, 496).setOrigin(0).setStrokeStyle(1, 0xffffff);

    // selector de yokais
    for (let i = 0; i < YOKAIS.length; i++) {
      const config = YOKAIS[i];

      const slot = scene.add.rectangle(25, 100 + i * 95, 110, 85).setOrigin(0)
        .setStrokeStyle(1, 0xffffff)
        .setInteractive();

      // placeholder del yokai (mismo tamaño que en el tablero)
      const icon = scene.add.rectangle(80, 132 + i * 95, 45, 45, config.color);  

      // precio
      const costText = scene.add.text(80, 172 + i * 95, String(config.cost), styles.slot).setOrigin(0.5);

      this.slots.push({ config, slot, icon, costText });

      slot.on("pointerdown", () => this.select(config, slot));
    }
    // botón de borrar
    this.eraseButton = scene.add.text(80, 100 + YOKAIS.length * 95 + 40, "Borrar", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.toggleErase());

    this.updateAffordable();  // actualizar el estado inicial de los huecos
  }


  // suma alegría al contador con un pequeño salto del icono
  addJoy(amount) {
    this.joyAmount += amount;
    this.joy.setText("Alegría: " + this.joyAmount);
    this.updateAffordable();  //puede que ahora se pueda pagar algún yokai


    // feedback: el icono "salta"
    this.scene.tweens.killTweensOf(this.joyIcon);
    this.joyIcon.setScale(1);
    this.scene.tweens.add({
      targets: this.joyIcon,
      scale: 1.5,
      duration: 100,
      yoyo: true
    });
  }

  // comprueba si hay suficiente alegría para pagar el coste
  canAfford(cost) {
    return this.joyAmount >= cost;
  }

  // intenta gastar alegría; devuelve true si se ha podido
  spendJoy(cost) {
    if (!this.canAfford(cost)) return false;

    this.joyAmount -= cost;
    this.joy.setText("Alegría: " + this.joyAmount);
    this.updateAffordable();
    return true;
  }

  // apaga los huecos de los yokais que no se pueden pagar
  updateAffordable() {
    for (const s of this.slots) {
      const ok = this.canAfford(s.config.cost);
      s.icon.setAlpha(ok ? 1 : 0.3);
      s.costText.setColor(ok ? "#ffffff" : "#ff5555");
    }
  }

  // feedback: el contador parpadea en rojo
  flashNoJoy() {
    this.joy.setColor("#ff5555");
    this.scene.time.delayedCall(300, () => this.joy.setColor("#ffffff"));
  }

  // selecciona un yokai (si ya estaba seleccionado, lo deselecciona)
  select(config, slot) {
    const same = this.selected === config;
    this.clearSelection();
    if (same) return;

     // no se puede seleccionar si no hay alegría suficiente
    if (!this.canAfford(config.cost)) {
      this.flashNoJoy();
      return;
    }
    this.selected = config;
    this.selectedSlot = slot;
    slot.setStrokeStyle(3, 0xffff00);
  }

   // activa/desactiva el modo borrado
  toggleErase() {
    const wasErasing = this.erasing;
    this.clearSelection();
    if (wasErasing) return;

    this.erasing = true;
    this.eraseButton.setColor("#ffff00");
  }

  // quita la selección actual
  clearSelection() {
    if (this.selectedSlot) this.selectedSlot.setStrokeStyle(1, 0xffffff);
    this.selected = null;
    this.selectedSlot = null;

    this.erasing = false;
    this.eraseButton.setColor("#ffffff");
  }

}
