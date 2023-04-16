import food from './food.js';
export default class Player extends food {

  constructor(x, y, m, id, name) {

    super(x, y, m);

    this.id = id;

    this.name = name;

  }

}

Player.prototype.show = function(ctx) {

  ctx.beginPath();

  this.r = Math.sqrt(this.mass / Math.PI) * 40;

  ctx.fillStyle = this.color;
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = 'white';

  let fontSize = 12*(this.r/this.originalR);

  ctx.font = fontSize+"px arcade_interlacedregular";
  ctx.fillText(Math.floor(this.mass), this.pos.x-fontSize/2, this.pos.y+this.r/8);

  ctx.fillStyle = 'black';
  ctx.fillText(this.name, this.pos.x-fontSize/2*this.name.length/2, this.pos.y+this.r/2);



  ctx.closePath();

}
Player.prototype.Score = function() {
  return Math.floor(this.mass);
}

Player.prototype.setData = function(data) {

  this.pos.x = data.pos.x;
  this.pos.y = data.pos.y;
  this.mass = data.m;
  this.color = data.color;
  this.id = data.id;
  this.name = data.name;

}