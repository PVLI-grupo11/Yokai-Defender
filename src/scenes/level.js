import HUD from "../ui/HUD.js";

// carriles (5x9) TODO: meter a una clase tablero?
const ROWS = 5, COLS = 9;
const WIDTH = 70, HEIGHT = 100;
const GRID_X = 160, GRID_Y = 80;

export default class Level extends Phaser.Scene {
  constructor() { super("level"); }

  create() {
    // carriles
    for (let i = 0; i < ROWS; i++)
      for (let j = 0; j < COLS; j++)
        this.add.rectangle(GRID_X + j * WIDTH, GRID_Y + i * HEIGHT, WIDTH - 4, HEIGHT - 4).setOrigin(0).setStrokeStyle(1, 0xffffff);

    this.hud = new HUD(this);


  }
}
