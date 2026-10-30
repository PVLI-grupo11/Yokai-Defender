import HUD from "../ui/HUD.js";
import { JOY_DELAY, JOY_VALUE, JoyYokai, FireYokai, PlantYokai, WaterYokai } from "../objects/yokai.js";

// carriles (5x9) TODO: meter a una clase tablero?
const ROWS = 5, COLS = 9;
const WIDTH = 70, HEIGHT = 100;
const GRID_X = 160, GRID_Y = 80;

export default class Level extends Phaser.Scene {
  constructor() { super("level"); }

  create() {
    // matriz con lo que hay en cada casilla (null = vacía)
    this.grid = [];

     // carriles
    for (let i = 0; i < ROWS; i++) {
      this.grid[i] = [];
      for (let j = 0; j < COLS; j++) {
        this.grid[i][j] = null;

        this.add.rectangle(GRID_X + j * WIDTH, GRID_Y + i * HEIGHT, WIDTH - 4, HEIGHT - 4).setOrigin(0)
          .setStrokeStyle(1, 0xffffff)
          .setInteractive()
          .on("pointerdown", () => this.onCellClick(i, j));
      }
    }

    this.hud = new HUD(this, [JoyYokai, FireYokai, PlantYokai, WaterYokai]);  // yokais disponibles en este nivel
  
    // cada JOY_DELAY ms se genera alegría
    this.time.addEvent({
    delay: JOY_DELAY,
    loop: true,
    callback: () => this.hud.addJoy(JOY_VALUE)
  });
    
  }
   
// centro (en píxeles) de la casilla (fila, columna)
  cellCenter(row, col) {
    return {
      x: GRID_X + col * WIDTH + (WIDTH - 4) / 2,
      y: GRID_Y + row * HEIGHT + (HEIGHT - 4) / 2
    };
  }

   // decide qué hacer al pulsar una casilla según el modo del HUD
  onCellClick(row, col) {
    if (this.hud.erasing) this.removeYokai(row, col);
    else this.placeYokai(row, col);
  }

  // coloca el yokai seleccionado en la casilla (fila, columna)
  placeYokai(row, col) {
    const icon = this.hud.selected;      // yokai de muestra del selector
    if (!icon) return;                   // no hay yokai seleccionado
    if (this.grid[row][col]) return;     // casilla ocupada
    if (!this.hud.spendJoy(icon.cost)) return;  //no hay alegría suficiente (si la hay, la gasta)

    const { x, y } = this.cellCenter(row, col);

    // crea uno nuevo del mismo tipo que el de muestra y empieza a actuar
    this.grid[row][col] = new icon.constructor(this, x, y);
    this.grid[row][col].start();
    this.hud.cashbacks.add(this.grid[row][col].cashbackText);  // se muestra en modo borrado
    this.hud.clearSelection();
  }

  // borra el yokai de la casilla (fila, columna)
  removeYokai(row, col) {
    const yokai = this.grid[row][col];
    if (!yokai) return;                  // casilla vacía

    this.hud.addJoy(Math.floor(yokai.cost / 2)); // devuelve la mitad de lo que costó

    yokai.destroy();
    this.grid[row][col] = null;
    this.hud.clearSelection();
  }
}
