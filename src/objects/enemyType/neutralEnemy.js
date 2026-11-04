import Enemy from "../enemy.js";

export default class NeutralEnemy extends Enemy {
  constructor(scene, row) { super(scene, row, "neutral", 100, 30); }
}