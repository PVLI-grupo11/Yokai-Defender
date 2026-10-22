// clase prov de los yokai (habrá que cambiarlo)

export default class Enemy extends Phaser.GameObjects.Rectangle {
  
  constructor(scene, x, y, health, speed) {
    super(scene, x, y, 40, 60);


    this.health = health;
    this.speed = speed;
    

    this.setStrokeStyle(1, 0xff0000);
    scene.add.existing(this);

  }
}
