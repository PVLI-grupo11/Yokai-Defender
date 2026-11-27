import { FireEnemy, WaterEnemy, PlantEnemy } from "../objects/enemies.js";

// nombre que se usa en waves.json para cada tipo de enemigo
const ENEMIES = { fire: FireEnemy, water: WaterEnemy, plant: PlantEnemy };

// controla qué oleada toca, cuándo sale cada enemigo y cuándo se gana.
export default class WaveManager {

  constructor(scene) {
    this.scene = scene;

    const data = scene.cache.json.get("waves");
    this.waves = data.waves;                  // lista de oleadas
    this.restTime = data.restTime * 1000;     // descanso entre oleadas
    this.healthIncrease = data.healthIncrease; // cuánto sube la vida de los enemigos en cada oleada
    this.healthBonus = 1;                      // multiplicador de vida de la oleada actual

    this.wave = 0;             // oleada actual 
    this.resting = true;       // true durante el descanso, false durante una oleada
    this.restLeft = data.prepTime * 1000; // ms que quedan de descanso 
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

      // a partir de la segunda oleada, los enemigos tienen más vida
      if (this.wave > 1) this.healthBonus *= this.healthIncrease;

      this.scene.hud.setWaveText("Oleada " + this.wave + "/" + this.waves.length);
    }
    else {
      const seconds = Math.round(this.restLeft / 1000); // de ms a segundos, sin decimales
      this.scene.hud.setWaveText("Oleada " + (this.wave + 1) + "/" + this.waves.length + " en " + seconds + "s");
    }
  }

  // oleada: saca a los enemigos cuando les toca y comprueba si ha acabado
  updateWave(delta) {
    this.waveTime += delta;
    const enemies = this.waves[this.wave - 1]; // las oleadas se cuentan desde 1 y la lista desde 0

    // saca a todos los enemigos a los que ya los toque salir
    while (this.nextEnemy < enemies.length && enemies[this.nextEnemy].time * 1000 <= this.waveTime) {
      const enemy = enemies[this.nextEnemy];
      const newEnemy = new ENEMIES[enemy.type](this.scene, enemy.row);
      newEnemy.multiplyHealth(this.healthBonus);
      this.nextEnemy++;
    }

    // la oleada acaba cuando ya han salido todos sus enemigos y no queda ninguno vivo
    const allOut = this.nextEnemy === enemies.length;
    if (allOut && this.scene.enemies.countActive() === 0) {
      if (this.wave === this.waves.length) this.scene.scene.start("result", { win: true });
      else {
        this.resting = true;
        this.restLeft = this.restTime;
      }
    }
  }
}
