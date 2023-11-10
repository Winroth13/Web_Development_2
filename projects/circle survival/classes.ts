export type velocity = {
  x: number;
  y: number;
};

export class movingObject {
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
}
