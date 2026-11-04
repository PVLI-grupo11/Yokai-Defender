import Enemy from "../enemy.js";

export default class PlantEnemy extends Enemy {
  constructor(scene, row) {
    super(scene, row, "plant", 100, 20);
    this.maxHealth = 100;
    this.regenTime = 0;     // ms desde la última vez que se curó
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);     // hace todo lo del padre: animarse, andar y comer

    this.regenTime += delta;
    if (this.regenTime >= 2000) {     // cada 2 segundos recupera 10 de vida, sin pasarse del máximo
      this.regenTime = 0;
      this.health = Math.min(this.health + 10, this.maxHealth);
    }
  }
}