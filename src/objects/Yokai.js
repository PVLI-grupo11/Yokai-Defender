// clase prov de los yokais (habrá que cambiarlo)

export default class Yokai extends Phaser.GameObjects.Rectangle {
  
  constructor(scene, x, y, config) {
    super(scene, x, y, 45, 45, config.color);

    this.kind = config.key;
    this.cost = config.cost;
    this.health = config.health;

    this.setStrokeStyle(1, 0xffffff);
    scene.add.existing(this);
  }
}
