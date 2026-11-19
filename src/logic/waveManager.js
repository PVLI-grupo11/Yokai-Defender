import { FireEnemy, WaterEnemy, PlantEnemy } from "../objects/enemies.js";

const ENEMIES = { fire: FireEnemy, water: WaterEnemy, plant: PlantEnemy };

const PREP_TIME = 10000; // ms para colocar yokais antes de la primera oleada
const REST_TIME = 5000; // ms de descanso entre oleadas

// oleadas scripteadas
const WAVES = [
  [[0, "plant", 2], [6000, "plant", 1], [12000, "plant", 3], [18000, "plant", 2]],

  [[0, "plant", 0], [4000, "fire", 2], [8000, "plant", 4], [12000, "fire", 1],
   [16000, "plant", 3], [20000, "fire", 2]],

  [[0, "water", 2], [3000, "plant", 0], [6000, "fire", 4], [10000, "water", 1],
   [13000, "fire", 3], [16000, "plant", 2], [20000, "fire", 0], [22000, "water", 4]],

  [[0, "fire", 1], [2000, "fire", 3], [5000, "water", 2], [8000, "plant", 0],
   [10000, "plant", 4], [13000, "water", 1], [15000, "fire", 2], [17000, "fire", 4],
   [20000, "water", 3], [22000, "fire", 0]],

  [[0, "water", 0], [2000, "water", 4], [5000, "fire", 2], [7000, "plant", 1],
   [9000, "plant", 3], [12000, "water", 2], [14000, "fire", 0], [16000, "fire", 4],
   [20000, "fire", 1], [20000, "fire", 3], [21000, "water", 2], [24000, "plant", 0],
   [24000, "plant", 4], [25000, "fire", 2]],
];

// controla qué oleada toca, cuándo sale cada enemigo y cuándo se gana.
export default class WaveManager {

  constructor(scene) {
    this.scene = scene;
    this.wave = 0;             // oleada actual 
    this.resting = true;       // true durante el descanso, false durante una oleada
    this.restLeft = PREP_TIME; // ms que quedan de descanso
    this.waveTime = 0;         // ms que lleva la oleada actual
    this.nextEnemy = 0;        // posición en la lista del próximo enemigo que va a salir
  }

  // se llama en cada update de la escena
  update(delta) {
    if (this.resting) this.updateRest(delta);
    else this.updateWave(delta);
  }

  // descanso: resta el tiempo y, cuando llega a 0, empieza la siguiente oleada
  updateRest(delta) {
    this.restLeft -= delta;

    if (this.restLeft <= 0) {
      this.resting = false;
      this.wave++;
      this.waveTime = 0;
      this.nextEnemy = 0;
      this.scene.hud.setWaveText("Oleada " + this.wave + "/" + WAVES.length);
    }
    else {
      const seconds = Math.round(this.restLeft / 1000); // de ms a segundos, sin decimales
      this.scene.hud.setWaveText("Oleada " + (this.wave + 1) + "/" + WAVES.length + " en " + seconds + "s");
    }
  }

  // oleada: saca a los enemigos cuando les toca y comprueba si ha acabado
  updateWave(delta) {
    this.waveTime += delta;
    const enemies = WAVES[this.wave - 1]; // las oleadas se cuentan desde 1 y la lista desde 0

    // saca a todos los enemigos a los que ya les ha llegado su momento
    while (this.nextEnemy < enemies.length && enemies[this.nextEnemy][0] <= this.waveTime) {
      const type = enemies[this.nextEnemy][1];
      const row = enemies[this.nextEnemy][2];
      new ENEMIES[type](this.scene, row);
      this.nextEnemy++;
    }

    // la oleada acaba cuando ya han salido todos sus enemigos y no queda ninguno vivo
    const allOut = this.nextEnemy === enemies.length;
    if (allOut && this.scene.enemies.countActive() === 0) {
      if (this.wave === WAVES.length) this.scene.scene.start("result", { win: true });
      else {
        this.resting = true;
        this.restLeft = REST_TIME;
      }
    }
  }
}
