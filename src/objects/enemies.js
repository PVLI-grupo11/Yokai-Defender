// TODO: meter animaciones de cada enemigo (dos frames para el avance,
// dos para "comer" o destruir yokai y dos para cuando muere)

export default class Enemy extends Phaser.GameObjects.Sprite {

  constructor(scene, row, type, health, speed) {
    const { y } = scene.getGridPos(row, 0);     // la y de su fila
    super(scene, scene.scale.width + 40, y, "enemy-" + type);    //nace fuera a la derecha, en la fila que le toca

    this.health = health;
    this.speed = speed;

    scene.add.existing(this);
    scene.enemies.add(this);
    this.body.setSize(48, 60);
    this.body.setVelocityX(-speed);
  }

  // recibe daño, si se queda sin vida, muere
  damage(damage) {
    this.health -= damage;
    if (this.health <= 0) this.destroy();
  }
}

export class FireEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "fire", 100, 60); }
}

export class PlantEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "plant", 100, 20); }
}

export class WaterEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "water", 200, 15); }
}