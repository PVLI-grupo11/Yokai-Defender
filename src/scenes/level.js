import HUD from "../ui/HUD.js";
import Yokai from "../objects/Yokai.js";
import Joy from "../objects/Joy.js";

// carriles (5x9) TODO: meter a una clase tablero?
const ROWS = 5, COLS = 9;
const WIDTH = 70, HEIGHT = 100;
const GRID_X = 160, GRID_Y = 80;

// alegría que cae del cielo
const JOY_DELAY = 3000;   // ms entre cada alegría
const JOY_VALUE = 25;     // alegría que da cada una

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

    this.hud = new HUD(this);
  
    // cada JOY_DELAY ms cae una alegría
    this.time.addEvent({
    delay: JOY_DELAY,
    loop: true,
    callback: () => this.spawnJoy()
  });
    
  }
   
// centro (en píxeles) de la casilla (fila, columna)
  cellCenter(row, col) {
    return {
      x: GRID_X + col * WIDTH + (WIDTH - 4) / 2,
      y: GRID_Y + row * HEIGHT + (HEIGHT - 4) / 2
    };
  }

  // crea una alegría que cae sobre una casilla aleatoria
  spawnJoy() {
    const row = Phaser.Math.Between(0, ROWS - 1);
    const col = Phaser.Math.Between(0, COLS - 1);
    const { x, y } = this.cellCenter(row, col);

    new Joy(this, x, y, JOY_VALUE, this.hud);
  }

   // decide qué hacer al pulsar una casilla según el modo del HUD
  onCellClick(row, col) {
    if (this.hud.erasing) this.removeYokai(row, col);
    else this.placeYokai(row, col);
  }

  // coloca el yokai seleccionado en la casilla (fila, columna)
  placeYokai(row, col) {
    const config = this.hud.selected;
    if (!config) return;                 // no hay yokai seleccionado
    if (this.grid[row][col]) return;     // casilla ocupada
    if (!this.hud.spendJoy(config.cost)) return;  //no hay alegría suficiente (si la hay, la gasta)

    const { x, y } = this.cellCenter(row, col);

    this.grid[row][col] = new Yokai(this, x, y, config);
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
