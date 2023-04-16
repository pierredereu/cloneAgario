export default class food {
  constructor(x, y, m) {

    this.color = 'hsl(' + Math.floor(255 * Math.random()) + ',100%,50%)';

    this.pos = {
      x: x,
      y: y
    };

    this.mass = m;
    this.originalMass = this.mass;

    this.r = Math.sqrt(this.mass / Math.PI) * 40;
    this.originalR = this.r;

  }
  show(ctx) {

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

  }
  inWindow(px, py, cw, ch) {

    return (this.pos.x >= px - cw / 2 && this.pos.x <= px + cw / 2 && this.pos.y >= py - ch / 2 && this.pos.y <= py + ch / 2);

  }
}



