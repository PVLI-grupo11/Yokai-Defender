import Start from "./scenes/start.js";
import Level from "./scenes/level.js";
import Result from "./scenes/result.js";

// estilos para el juego (textos y movidas)
export const styles = {
  title: { fontSize: "48px" }
};

new Phaser.Game({
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  canvas: document.querySelector("canvas"),
  scene: [Start, Level, Result]
});
