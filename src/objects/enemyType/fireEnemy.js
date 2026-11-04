import Enemy from "../enemy.js";

export default class FireEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "fire", 100, 60); }
}