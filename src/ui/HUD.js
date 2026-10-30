import { styles } from "../game.js";

export default class HUD {

  constructor(scene, yokais) {   // yokais = tipos (clases) del selector, en orden

    this.scene = scene;        //para poder crear temporizadores desde addJoy
    this.joyAmount = 0;        //alegría acumulada

    this.selected = null;      // yokai de muestra seleccionado (o null si no hay)
    this.selectedSlot = null;  // rectángulo del hueco resaltado
    this.erasing = false;      // true = modo borrado activo
    this.slots = [];          //huecos del selector (para actualizar si se pueden pagar)
    this.cashbacks = scene.add.group();  // textos de devolución de los yokais del tablero


    // barra superior
    scene.add.text(60, 30, "Volver", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("start"));

    // alegría
   this.joyIcon = scene.add.circle(140, 30, 10, 0xffd23f).setStrokeStyle(1, 0xffffff);  
   this.joy = scene.add.text(158, 30, "Alegría: 0", styles.button).setOrigin(0, 0.5);
   this.joyGain = scene.add.text(0, 30, "", styles.slot).setOrigin(0, 0.5);  // +X / -X al recibir o gastar alegría
   this.gainTimer = scene.time.delayedCall(0, () => {});  // temporizador que borra el +X / -X

    // indicador oleada
    this.wave = scene.add.text(550, 30, "Oleada 1/5", styles.button).setOrigin(0.5);

    // boton para ir a resultado
    scene.add.text(750, 30, "Fin", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("result"));

    // templo
    scene.add.rectangle(10, 80, 140, 496).setOrigin(0).setStrokeStyle(1, 0xffffff);

    // selector de yokais
    for (let i = 0; i < yokais.length; i++) {
      const slot = scene.add.rectangle(25, 100 + i * 95, 110, 85).setOrigin(0)
        .setStrokeStyle(1, 0xffffff)
        .setInteractive();

      // yokai de muestra (el mismo que se pondrá en el tablero, pero sin empezar a actuar)
      const icon = new yokais[i](scene, 80, 132 + i * 95);

      // precio
      const costText = scene.add.text(80, 172 + i * 95, String(icon.cost), styles.slot).setOrigin(0.5);

      this.slots.push({ slot, icon, costText });

      slot.on("pointerdown", () => this.select(icon, slot));
    }
    // botón de borrar
    this.eraseButton = scene.add.text(80, 100 + yokais.length * 95 + 40, "Borrar", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.toggleErase());

    this.updateAffordable();  // actualizar el estado inicial de los huecos
  }


  // suma (o resta, si es negativa) alegría al contador mostrando a su derecha la cantidad
  addJoy(amount) {
    this.joyAmount += amount;
    this.joy.setText("Alegría: " + this.joyAmount);
    this.updateAffordable();  //puede que ahora se pueda pagar algún yokai (o ya no)

    // feedback: aparece "+X" en amarillo o "-X" en rojo junto al contador durante un segundo
    if (amount > 0) this.joyGain.setText("+" + amount).setColor("#ffd23f");
    else this.joyGain.setText(String(amount)).setColor("#ff5555");

    this.joyGain.setX(this.joy.x + this.joy.width + 8);
    this.gainTimer.remove();
    this.gainTimer = this.scene.time.delayedCall(1000, () => this.joyGain.setText(""));
  }

  // comprueba si hay suficiente alegría para pagar el coste
  canAfford(cost) {
    return this.joyAmount >= cost;
  }

  // intenta gastar alegría; devuelve true si se ha podido
  spendJoy(cost) {
    if (!this.canAfford(cost)) return false;

    this.addJoy(-cost);
    return true;
  }

  // apaga los huecos de los yokais que no se pueden pagar
  updateAffordable() {
    for (const s of this.slots) {
      const ok = this.canAfford(s.icon.cost);
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
  select(icon, slot) {
    const same = this.selected === icon;
    this.clearSelection();
    if (same) return;

     // no se puede seleccionar si no hay alegría suficiente
    if (!this.canAfford(icon.cost)) {
      this.flashNoJoy();
      return;
    }
    this.selected = icon;
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
    this.cashbacks.setVisible(true);  // muestra lo que devuelve cada yokai
  }

  // quita la selección actual
  clearSelection() {
    if (this.selectedSlot) this.selectedSlot.setStrokeStyle(1, 0xffffff);
    this.selected = null;
    this.selectedSlot = null;

    this.erasing = false;
    this.eraseButton.setColor("#ffffff");
    this.cashbacks.setVisible(false);
  }

}
