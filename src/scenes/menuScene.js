export default class MenuScene extends Phaser.Scene {

  // fuente de los menús 
  static FONT = '"Shippori Mincho", serif';

  // fondo común de los menús: atardecer
  addBackground() {
    this.add.image(0, 0, "menu-background").setOrigin(0);
  }

  // panel oscuro con borde dorado para poner texto encima
  addPanel(x, y, width, height) {
    const g = this.add.graphics();
    g.fillStyle(0x140a1c, 0.8);
    g.fillRoundedRect(x, y, width, height, 16);
    g.lineStyle(3, 0xe8c170);
    g.strokeRoundedRect(x, y, width, height, 16);
    return g;
  }

  // título grande centrado
  addTitle(y, text, size = 48) {
    return this.add.text(400, y, text, {
      fontFamily: MenuScene.FONT,
      fontSize: size + "px",
      fontStyle: "bold",
      color: "#ffe3a3",
      stroke: "#3a0d10",
      strokeThickness: 8
    }).setOrigin(0.5).setShadow(3, 4, "#000000", 6, true, true);
  }

  // texto normal con la fuente de los menús
  addText(x, y, text, size, color = "#fff4dc", bold = false) {
    const style = { fontFamily: MenuScene.FONT, fontSize: size + "px", color: color, align: "center" };
    if (bold) style.fontStyle = "bold";
    return this.add.text(x, y, text, style);
  }
}
