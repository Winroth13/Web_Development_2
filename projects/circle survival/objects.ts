type velocity = {
  x: number;
  y: number;
};

class MovingObject {
  x: number;
  y: number;
  radius: number;
  colour: string;
  velocity: velocity;

  constructor(
    x: number,
    y: number,
    radius: number,
    colour: string,
    velocity: velocity
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
