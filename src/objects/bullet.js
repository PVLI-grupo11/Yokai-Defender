const BULLET_SPEED = 300;

// clase de la bala
export default class Bullet extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y, color, damage, atraviesa = false) {
    super(scene, x, y, 12, 12, color);

    this.damage = damage;
    this.atraviesa = atraviesa;  // para las balas de fuego que atraviesan a los enemigos
    if (atraviesa) this.hitEnemies = []; // el overlap puede repetirse mientras sigue tocando al enemigo

    scene.add.existing(this);
    scene.bullets.add(this);
    this.body.setVelocityX(BULLET_SPEED);
  }

  hit(enemy) {
    if (this.active && (!this.atraviesa || !this.hitEnemies.includes(enemy))) {
      enemy.damage(this.damage);
      if (this.atraviesa) this.hitEnemies.push(enemy);
      else this.destroy();
    }
  }

  preUpdate() {
    if (this.x > this.scene.scale.width) this.destroy();
  }
}
