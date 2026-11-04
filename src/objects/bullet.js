const blspeed = 300;

//clase de la bala
export default class Bullet extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y, color, damage, atraviesa = false) {
    super(scene, x, y, 12, 12, color);

    this.damage = damage;
    this.atraviesa = atraviesa;  // para las balas de fuego que atraviesan a los enemigos
    this.hitEnemies = new Set();  //esto es para que no le de al mismo enemigo todo el rato por frame

    scene.add.existing(this);
  }

  preUpdate(time, delta) {
  this.x += blspeed * delta / 1000;

  const bounds = this.getBounds();
  const enemies = this.scene.enemies.getChildren();

  for (let i = enemies.length - 1; i >= 0; i--) { //recorre los enemigos de atrás hacia adelante para que no haya problemas al eliminar enemigos
    const enemy = enemies[i];

    if (this.hitEnemies.has(enemy)) continue;
    if (!Phaser.Geom.Intersects.RectangleToRectangle(bounds, enemy.getBounds())) continue; //comprueba colision

    enemy.takeDamage(this.damage);
    if (!this.atraviesa) {
      this.destroy();
      return;
    }
    this.hitEnemies.add(enemy);
  }

  if (this.x > this.scene.scale.width) this.destroy();
}
}
