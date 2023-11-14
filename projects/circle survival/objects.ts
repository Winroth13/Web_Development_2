type velocity = {
  x: number;
  y: number;
};

class MovingObject {
  xPos: number;
  yPos: number;
  radius: number;
  colour: string;
  velocity: velocity;

  constructor(xPos: number, yPos: number, radius: number, colour: string) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.colour = colour;
    this.velocity = { x: 0, y: 0 };
  }

  draw() {
    this.update();

    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
  }

  update() {
    this.xPos += this.velocity.x;
    this.yPos += this.velocity.y;
  }
}

class Player extends MovingObject {
  targetVelocity: velocity;

  constructor(xPos: number, yPos: number, radius: number, colour: string) {
    super(xPos, yPos, radius, colour);
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

    this.xPos += this.velocity.x;
    this.yPos += this.velocity.y;
  }
}

class Enemy extends MovingObject {
  minRadius: number;

  constructor(xPos: number, yPos: number, radius: number, colour: string) {
    super(xPos, yPos, radius, colour);
    this.minRadius = this.radius;
  }

  update() {
    if (this.radius > this.minRadius) {
      this.radius -= 1;
    }

    let newAngle = Math.atan2(player.yPos - this.yPos, player.xPos - this.xPos);

    let newVelocity = {
      x: Math.cos(newAngle),
      y: Math.sin(newAngle),
    };

    this.velocity = newVelocity;

    this.xPos += this.velocity.x;
    this.yPos += this.velocity.y;
  }
}

class Projectile extends MovingObject {
  constructor(
    xPos: number,
    yPos: number,
    radius: number,
    colour: string,
    velocity: velocity
  ) {
    super(xPos, yPos, radius, colour);
    this.velocity = velocity;
  }
}
