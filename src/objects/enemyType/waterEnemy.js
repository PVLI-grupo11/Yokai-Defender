import Enemy from "../enemy.js";

export default class WaterEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "water", 200, 15); }
}