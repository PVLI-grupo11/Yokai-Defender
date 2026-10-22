// clase prov de las torres (habrá que cambiarlo)

export default class Tower extends Phaser.GameObjects.Rectangle {
  
  constructor(scene, x, y, cost, health) {
    super(scene, x, y, 45, 45);

    
    this.cost = cost;
    this.health = health;

    this.setStrokeStyle(1, 0xffffff);
    scene.add.existing(this);
  }
}
