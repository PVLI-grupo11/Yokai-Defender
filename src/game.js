import Start from "./scenes/start.js";
import Level from "./scenes/level.js";
import Result from "./scenes/result.js";

// estilos para el juego (textos y movidas)
export const styles = {
  title: { fontSize: "48px" },
  button: { fontSize: "24px" }, // botón genérico del juego
  cashback_text: { fontSize: "16px", align: "center", color: "#ffd23f" }, // texto que muestra el cashback
  yokai_slot: { fontSize: "16px", align: "center" }, // precio en el selector de yokais
};

// configs generales del juego (A lo mejor conviene tener esto en cada clase correspondiente pero por comodidad...)
export const configs = {
  JOY_DELAY: 6000, // ms entre cada generación de alegría
  JOY_VALUE: 25, // cantidad de alegría que se genera
};

new Phaser.Game({
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  canvas: document.querySelector("canvas"),
  physics: {
    default: "arcade"
  },
  scene: [ Start, Level, Result ]
});
