const canvas = document.querySelector("canvas")!;

const ctx = canvas.getContext("2d")!;

canvas.width = innerWidth;
canvas.height = innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const projectileSpeed: number = 5;

type Velocity = {
  x: number;
  y: number;
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

class Enemy extends Projectile {
  minRadius: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    colour: string,
    velocity: Velocity
  ) {
    super(x, y, radius, colour, velocity);
    this.minRadius = this.radius;
  }

  update() {
    if (this.radius > this.minRadius) {
      this.radius -= 1;
    }

    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

const player = new Player(centerX, centerY, 10, "white");

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

    const colour = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`;

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
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  // Porjectiles flying off the screen
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
      }, 0);
    }
  });

  // Enemy touching player
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (distance - enemy.radius - player.radius < 0) {
      cancelAnimationFrame(animationID);
    }

    // Enemy touching projectile
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );

      if (distance - enemy.radius - projectile.radius < 0) {
        if (enemy.minRadius > 20) {
          enemy.minRadius -= 10;
        } else {
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
          }, 0);
        }
        setTimeout(() => {
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
  });
}

addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

  const velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) * projectileSpeed,
  };

  projectiles.push(new Projectile(centerX, centerY, 5, "white", velocity));
});

animate();
spawnEnemies();

// https://www.youtube.com/watch?v=eI9idPTT0c4
