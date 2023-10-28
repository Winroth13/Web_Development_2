const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreDisplay = document.querySelector<HTMLElement>("#scoreDisplay")!;
const scoreElement = document.querySelector("#scoreElement")!;

const gameOverDisplay =
  document.querySelector<HTMLElement>("#gameOverDisplay")!;
const startGameButton = document.querySelector("#startGameButton")!;
const finalScoreElement = document.querySelector("#finalScoreElement")!;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const projectileSpeed: number = 5;
const particleFriction: number = 0.98;

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

class Particle extends Projectile {
  alpha: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    colour: string,
    velocity: Velocity
  ) {
    super(x, y, radius, colour, velocity);
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();

    this.velocity.x *= particleFriction;
    this.velocity.y *= particleFriction;

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.alpha -= 0.01;
  }
}

const player = new Player(centerX, centerY, 10, "white");

let projectiles: Projectile[] = [];
let enemies: Enemy[] = [];
let particles: Particle[] = [];

// Whenever a new game starts
function inti() {
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreElement.innerHTML = score.toString();
}

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

function updateParticles() {
  particles.forEach((particle, index) => {
    particle.update();
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
}

function projectilesOffScreen() {
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
}

function enemyHittingPlayer(enemy: Enemy) {
  const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

  // End game
  if (distance - enemy.radius - player.radius < 0) {
    cancelAnimationFrame(animationID);
    gameOverDisplay.style.display = "flex";
    finalScoreElement.innerHTML = score.toString();
    scoreDisplay.style.display = "none";
    removeEventListener("click", createProjectile);
  }
}

function enemyProjectileCollision(enemy: Enemy, enemyIndex: number) {
  projectiles.forEach((projectile, projectileIndex) => {
    const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

    if (distance - enemy.radius - projectile.radius < 0) {
      //Increase score
      score += 1;
      scoreElement.innerHTML = score.toString();

      //Create explosion
      for (let i = 0; i < enemy.radius * 2; i++) {
        particles.push(
          new Particle(
            projectile.x,
            projectile.y,
            Math.random() * 2,
            enemy.colour,
            {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            }
          )
        );
      }

      // Shrink enemy
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
}

let animationID: number;
let score: number = 0;
function animate() {
  animationID = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  // Particles
  updateParticles();

  // Porjectiles flying off the screen
  projectilesOffScreen();

  // Alla enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    // Enemy hitting player
    enemyHittingPlayer(enemy);

    // Enemy touching projectile
    enemyProjectileCollision(enemy, enemyIndex);
  });
}

function createProjectile(event: MouseEvent) {
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

  console.log("object");

  const velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) * projectileSpeed,
  };

  projectiles.push(new Projectile(centerX, centerY, 5, "white", velocity));
}

startGameButton.addEventListener("click", () => {
  gameOverDisplay.style.display = "none";
  scoreDisplay.style.display = "block";
  inti();
  animate();
  spawnEnemies();
  setTimeout(() => {
    addEventListener("click", createProjectile);
  }, 0);
});
