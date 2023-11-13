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
    this.update();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Player extends MovingObject {
  targetVelocity: velocity;

  constructor(
    x: number,
    y: number,
    radius: number,
    colour: string,
    velocity: velocity
  ) {
    super(x, y, radius, colour, velocity);
    this.targetVelocity = this.velocity;
  }

  update() {
    if (this.velocity.y < this.targetVelocity.y) {
      this.velocity.y += playerAcceleration;
    } else if (this.velocity.y > this.targetVelocity.y) {
      this.velocity.y -= playerAcceleration;
    }

    if (this.velocity.x < this.targetVelocity.x) {
      this.velocity.x += playerAcceleration;
    } else if (this.velocity.x > this.targetVelocity.x) {
      this.velocity.x -= playerAcceleration;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
