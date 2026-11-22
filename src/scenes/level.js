import HUD from "../ui/HUD.js";
import { configs } from "../game.js";
import WaveManager from "../logic/waveManager.js";

// carriles (5x9) TODO: meter a una clase tablero?
const ROWS = 5, COLS = 9;
const WIDTH = 70, HEIGHT = 104;
const GRID_X = 160, GRID_Y = 80;

const EAT_DAMAGE = 20; // vida que quita un enemigo por segundo

export default class Level extends Phaser.Scene {
  constructor() { super("level"); }

  // las imágenes ya las ha cargado el menú principal (start.js)
  create() {
    // fondo
    this.add.image(0, 0, "background").setOrigin(0);

    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.yokais = this.physics.add.staticGroup();

    // cuando colisiona un enemigo con un yokai:
    this.physics.add.collider(this.enemies, this.yokais, (enemy, yokai) => {
      yokai.damage(EAT_DAMAGE / this.physics.world.fps);
      enemy.body.setVelocityX(-enemy.speed); // sigue "empujando" hasta que muere la torre
    });

    // las balas no empujan al enemigo al impactar (TODO: cambiar y permitir empuje?)
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => bullet.hit(enemy));

    // matriz de casillas
    this.grid = [];

    // dibujamos la grid
    for (let row = 0; row < ROWS; row++) {
      this.grid[row] = [];

      for (let col = 0; col < COLS; col++) {
        this.grid[row][col] = null;

        // TODO: centralizar el estilo del tablero
        this.add.rectangle(GRID_X + col * WIDTH, GRID_Y + row * HEIGHT, WIDTH - 4, HEIGHT)
          .setOrigin(0)
          .setStrokeStyle(1, 0xffffff);
      }
    }

    // creamos el HUD con la alegría inicial de la escena
    this.joy = 0;
    this.hud = new HUD(this);

    // cada JOY_DELAY ms se genera alegría
    this.time.addEvent({
      delay: configs.JOY_DELAY,
      loop: true,
      callback: () => this.addJoy(configs.JOY_VALUE)
    });

    // oleadas de enemigos (necesita el HUD ya creado)
    this.waves = new WaveManager(this);
  }

  // Phaser llama a update en cada frame. time: ms desde que empezó el juego, delta: ms desde el frame anterior
  update(time, delta) {
    this.waves.update(delta);
  }

  // suma o resta alegría y actualiza el HUD
  addJoy(amount) {
    this.joy += amount;
    this.hud.refresh(amount);
  }

  // centro en píxeles de una casilla
  getGridPos(row, col) {
    return {
      x: GRID_X + col * WIDTH + (WIDTH - 4) / 2,
      y: GRID_Y + row * HEIGHT + HEIGHT / 2
    };
  }

  // casilla bajo el cursor, sin contar el hueco entre columnas
  getGridCell(x, y) {
    const row = Math.floor((y - GRID_Y) / HEIGHT);
    const col = Math.floor((x - GRID_X) / WIDTH);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS && (x - GRID_X) % WIDTH < WIDTH - 4) return { row, col };
  }

  // coloca el yokai seleccionado en la casilla si está libre (siempre y cuando haya suficiente alegría)
  placeItem(row, col, YokaiType) {
    const canPlace = !this.grid[row][col] && this.joy >= YokaiType.cost;
    if (canPlace) {
      this.addJoy(-YokaiType.cost);
      const { x, y } = this.getGridPos(row, col);
      const yokai = new YokaiType(this, x, y);
      yokai.setSize(32, 60); // cuerpo más pequeño que la imagen, centrado en la casilla
      this.yokais.add(yokai);
      this.grid[row][col] = yokai;
      yokai.once("destroy", () => { this.grid[row][col] = null; });
      yokai.start();
    }
    return canPlace;
  }

  // borra el yokai a mano y devuelve parte de su coste
  removeCell(row, col) {
    const yokai = this.grid[row][col];
    if (yokai) {
      this.addJoy(yokai.refund);
      yokai.destroy();
    }
    return yokai !== null;
  }
}
