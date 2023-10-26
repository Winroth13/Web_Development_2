const canvas = document.querySelector("canvas")!;
console.log(canvas);

const ctx = canvas.getContext("2d")!;

canvas.width = innerWidth;
canvas.height = innerHeight;

type Velocity = {
  x: number;
  y: number;
};

type test = {
  x: number;
  y: number;
  radius: number;
  colour: string;
  velocity: Velocity;
};

class Player {
  x: number;
  y: number;
  radius: number;
  colour: string;

  constructor(x: number, y: number, radius: number, colour: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
  }
}

class Projectile extends Player {
  velocity: Velocity;

  constructor(
    x: number,
    y: number,
    radius: number,
    colour: string,
    velocity: Velocity
  ) {
    super(x, y, radius, colour);
    this.velocity = velocity;
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Enemy extends Projectile {}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const player = new Player(centerX, centerY, 30, "blue");

const projectiles: Projectile[] = [];
const enemies: Enemy[] = [];

function spawnEnemies() {
  setInterval(() => {
    const radius = 10 + Math.random() * 20;

    let x: number;
    let y: number;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    }

    const colour = "green";

    const angle = Math.atan2(centerY - y, centerX - x);

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, colour, velocity));
  }, 1000);
}

let animationID: number;
function animate() {
  animationID = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  projectiles.forEach((projectile) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
    }
  });
  // 1:02:??
  enemies.forEach((enemy: Enemy, enemyIndex) => {
    enemy.update();

    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (distance - enemy.radius - player.radius < 0) {
      cancelAnimationFrame(animationID);
    }

    projectiles.forEach((projectile: Projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );

      if (distance - enemy.radius - projectile.radius < 0) {
        setTimeout(() => {
          enemies.splice(enemyIndex, 1);
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
  });
}

addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  projectiles.push(new Projectile(centerX, centerY, 5, "red", velocity));
});

animate();
spawnEnemies();

// https://www.youtube.com/watch?v=eI9idPTT0c4
// 35:00
