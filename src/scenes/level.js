import HUD from "../ui/HUD.js";
import { JOY_DELAY, JOY_VALUE, JoyYokai, FireYokai, PlantYokai, WaterYokai } from "../objects/yokai.js";

import Enemy from "../objects/enemy.js";
import NeutralEnemy from "../objects/enemyType/neutralEnemy.js";
import FireEnemy from "../objects/enemyType/fireEnemy.js";
import WaterEnemy from "../objects/enemyType/waterEnemy.js";
import PlantEnemy from "../objects/enemyType/plantEnemy.js";

// carriles (5x9) TODO: meter a una clase tablero?
const ROWS = 5, COLS = 9;
const WIDTH = 70, HEIGHT = 104;
const GRID_X = 160, GRID_Y = 80;

const ENEMY_DELAY = 10000;   // ms entre cada enemigo, 10 segundos
const ENEMY_CLASSES = [NeutralEnemy, FireEnemy, WaterEnemy, PlantEnemy];

export default class Level extends Phaser.Scene {
  constructor() { super("level"); }

  preload() {
    this.load.svg("background", "assets/game/background.svg");
    this.load.svg("yokai-joy", "assets/game/yokais/joy.svg");
    this.load.svg("yokai-fire", "assets/game/yokais/fire.svg");
    this.load.svg("yokai-plant", "assets/game/yokais/plant.svg");
    this.load.svg("yokai-water", "assets/game/yokais/water.svg");


    // Enemigos
    this.load.svg("enemy-neutral", "assets/game/enemies/neutral_0.svg");
    this.load.svg("enemy-fire", "assets/game/enemies/fire_0.svg");
    this.load.svg("enemy-water", "assets/game/enemies/water_0.svg");
    this.load.svg("enemy-plant", "assets/game/enemies/plant_0.svg");
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0);

    this.enemies = this.add.group();

    // matriz con lo que hay en cada casilla (null = vacía)
    this.grid = [];

     // carriles
    for (let i = 0; i < ROWS; i++) {
      this.grid[i] = [];
      for (let j = 0; j < COLS; j++) {
        this.grid[i][j] = null;

        this.add.rectangle(GRID_X + j * WIDTH, GRID_Y + i * HEIGHT, WIDTH - 4, HEIGHT).setOrigin(0)
          .setStrokeStyle(1, 0xffffff)
          .setInteractive()
          .on("pointerdown", () => this.onCellClick(i, j));
      }
    }

    new Enemy(this, 2, "neutral", 100, 30);
    this.hud = new HUD(this, [JoyYokai, FireYokai, PlantYokai, WaterYokai]);  // yokais disponibles en este nivel
  
    // cada JOY_DELAY ms se genera alegría
    this.time.addEvent({
    delay: JOY_DELAY,
    loop: true,
    callback: () => this.hud.addJoy(JOY_VALUE)
  });

    // cada ENEMY_DELAY ms aparece un enemigo
    this.time.addEvent({
      delay: ENEMY_DELAY,
      loop: true,
      callback: () => this.spawnRandomEnemy()
    });   
  }
   
// centro (en píxeles) de la casilla (fila, columna)
  cellCenter(row, col) {
    return {
      x: GRID_X + col * WIDTH + (WIDTH - 4) / 2,
      y: GRID_Y + row * HEIGHT + HEIGHT / 2
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

  killYokai(row, col) {
    const yokai = this.grid[row][col];
    if (!yokai) return;                  // casilla vacía

    yokai.destroy();
    this.grid[row][col] = null;
    this.hud.clearSelection();
  }

  // crea un enemigo de tipo aleatorio en una fila aleatoria
  spawnRandomEnemy() {
    const EnemyClass = Phaser.Utils.Array.GetRandom(ENEMY_CLASSES);
    const row = Phaser.Math.Between(0, ROWS - 1);
    new EnemyClass(this, row);
  }
}
