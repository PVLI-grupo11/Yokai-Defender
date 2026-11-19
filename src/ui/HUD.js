import { styles } from "../game.js";
import { JoyYokai, FireYokai, PlantYokai, WaterYokai } from "../objects/yokais.js";

export default class HUD {

  constructor(scene) {
    this.scene = scene;
    this.selected = null; // slot seleccionado
    this.erase_mode = false; // si esta activo el modo borrado

    // barra superior
    scene.add.text(60, 30, "Volver", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("start"));

    // alegría
    scene.add.circle(140, 30, 10, 0xffd23f).setStrokeStyle(1, 0xffffff);
    this.joy = scene.add.text(158, 30, "Alegría: " + scene.joy, styles.button).setOrigin(0, 0.5);
    this.joyGain = scene.add.text(0, 30, "", styles.yokai_slot).setOrigin(0, 0.5);

    // indicador oleada
    this.waveText = scene.add.text(530, 30, "", styles.button).setOrigin(0.5);

    // botón para ir a resultado
    scene.add.text(750, 30, "Fin", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => scene.scene.start("result"));

    // templo
    scene.add.rectangle(10, 80, 140, 520).setOrigin(0).setStrokeStyle(1, 0xffffff);

    // selector de yokais
    this.joySlot = this.addSlot(JoyYokai, 100);
    this.fireSlot = this.addSlot(FireYokai, 195);
    this.plantSlot = this.addSlot(PlantYokai, 290);
    this.waterSlot = this.addSlot(WaterYokai, 385);

    // botón de borrar
    this.eraseButton = scene.add.text(80, 520, "Borrar", styles.button).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.toggleErase());

    this.refresh();
    scene.input.on("pointerdown", this.onBoardClick, this);
  }

  addSlot(YokaiType, y) {
    // TODO: centralizar el estilo del borde del slot
    const slot = this.scene.add.rectangle(25, y, 110, 85).setOrigin(0)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    // yokai de muestra (el mismo que se pondrá en el tablero, pero sin empezar a actuar)
    const icon = new YokaiType(this.scene, 80, y + 32);

    // precio
    const costText = this.scene.add.text(80, y + 72, String(YokaiType.cost), styles.yokai_slot).setOrigin(0.5);
    const option = { slot, icon, costText, YokaiType };

    slot.on("pointerdown", () => this.select(option));
    return option;
  }

  // actualiza el contador y los huecos de los yokais que se pueden pagar
  refresh(amount) {
    this.joy.setText("Alegría: " + this.scene.joy);
    this.updateSlot(this.joySlot);
    this.updateSlot(this.fireSlot);
    this.updateSlot(this.plantSlot);
    this.updateSlot(this.waterSlot);

    if (amount) {
      if (amount > 0) this.joyGain.setText("+" + amount).setColor("#ffd23f");
      else this.joyGain.setText(String(amount)).setColor("#ff5555");

      this.scene.tweens.killTweensOf(this.joyGain);
      this.joyGain.setX(this.joy.x + this.joy.width + 8).setAlpha(1);
      this.scene.tweens.add({
        targets: this.joyGain,
        alpha: 0,
        delay: 650,
        duration: 250
      });
    }
  }

  // texto de la oleada (la actual o la cuenta atrás de la siguiente)
  setWaveText(text) {
    this.waveText.setText(text);
  }

  // hace efecto de apagado si no hay suficiente alegria
  updateSlot({ icon, costText, YokaiType }) {
    if (this.scene.joy >= YokaiType.cost) {
      icon.setAlpha(1);
      costText.setColor("#ffffff");
    } else {
      icon.setAlpha(0.3);
      costText.setColor("#ff5555");
    }
  }

  // feedback: el contador parpadea en rojo
  flashNoJoy() {
    this.joy.setColor("#ff5555");
    this.scene.time.delayedCall(300, () => this.joy.setColor("#ffffff"));
  }

  // selecciona un yokai si hay alegría suficiente
  select(option) {
    this.clearSelection();

    if (this.scene.joy < option.YokaiType.cost) this.flashNoJoy();
    else {
      this.selected = option;
      option.slot.setStrokeStyle(3, 0xffff00);
    }
  }

  // el HUD decide qué acción intentar; la escena cambia el tablero
  onBoardClick(pointer) {
    const cell = this.scene.getGridCell(pointer.x, pointer.y);
    if (cell) {
      if (this.erase_mode) {
        if (this.scene.removeCell(cell.row, cell.col)) this.clearSelection();
      } else if (this.selected && this.scene.placeItem(cell.row, cell.col, this.selected.YokaiType)) this.clearSelection();
    }
  }

  // activa/desactiva el modo borrado
  toggleErase() {
    const wasErasing = this.erase_mode;
    this.clearSelection();
    if (!wasErasing) this.setEraseMode(true);
  }

  // quita la selección actual
  clearSelection() {
    if (this.selected) this.selected.slot.setStrokeStyle(1, 0xffffff);
    this.selected = null;
    this.setEraseMode(false);
  }

  setEraseMode(active) {
    this.erase_mode = active;
    if (active) this.eraseButton.setColor("#ffff00");
    else this.eraseButton.setColor("#ffffff");

    // solo muestra lo que devuelven los yokais colocados
    const yokais = this.scene.yokais.getChildren();
    for (let i = 0; i < yokais.length; i++) yokais[i].cashback.setVisible(active);
  }

}
