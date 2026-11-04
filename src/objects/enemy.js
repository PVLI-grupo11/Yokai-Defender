const EAT_DAMAGE = 20;       // vida que quita a un yokai por segundo
const TOUCH_DISTANCE = 40;   // a esta distancia ya lo está tocando

export default class Enemy extends Phaser.GameObjects.Sprite {
  
  constructor(scene, row, type, health, speed) {
    const { y } = scene.cellCenter(row, 0);     // la y de su fila
    super(scene, scene.scale.width + 40, y, "enemy-" + type + "-0");    //nace fuera a la derecha, en la fila que le toca

    this.row = row;
    this.health = health;
    this.speed = speed;
    this.enemyType = type;

    scene.add.existing(this);
    scene.enemies.add(this);
    this.play("enemy-" + type + "-walk");       // empieza su animación
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);               
    // si no está comiéndose a nadie, sigue andando
    if (this.eatYokai(delta)) {
      this.play("enemy-" + this.enemyType + "-eat", true);    // comiendo: no anda
    } 
    else {
      this.play("enemy-" + this.enemyType + "-walk", true);   // sin comer: anda
      this.x -= this.speed * delta / 1000;
    }
  }

  // muerde al yokai que esté tocando, devuelve true esta comiendo
  eatYokai(delta) {
    const cells = this.scene.grid[this.row];

    for(let col = 0; col < cells.length; col++) {
      const yokai = cells[col];

      if(yokai && Math.abs(yokai.x - this.x) < TOUCH_DISTANCE) {
        yokai.health -= EAT_DAMAGE * delta / 1000;
        if (yokai.health <= 0) {
          this.scene.killYokai(this.row, col);
        }
        return true;
      }
    }
    return false;
  }

  // recibe daño, si se queda sin vida, muere
  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) this.destroy();
  }
}
