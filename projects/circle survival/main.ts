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
const playerMaxSpeed: number = 5;
const playerAcceleration: number = 0.5;
const enemnySpawnDelay: number = 1000;
const particleFriction: number = 0.98;
const enemySpeed: number = 2;

const fps: number = 60;
// const timePerFrame: number = 1000 / fps;

const player = new Player(centerX, centerY, 10, "white");

let projectiles: Projectile[] = [];
let enemies: Enemy[] = [];
let particles: Particle[] = [];

let pressedKeys: string[] = [];

let animationID: number;
let score: number;

function init() {
  player.xPos = centerX;
  player.yPos = centerY;
  player.velocity = { x: 0, y: 0 };

  animationID = 0;

  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreElement.innerHTML = score.toString();
}

function playerKeyboardInput() {
  let moveUp = pressedKeys.includes("w") || pressedKeys.includes("ArrowUp");
  let moveDown = pressedKeys.includes("s") || pressedKeys.includes("ArrowDown");
  let moveLeft = pressedKeys.includes("a") || pressedKeys.includes("ArrowLeft");
  let moveRight =
    pressedKeys.includes("d") || pressedKeys.includes("ArrowRight");

  let newTargetVelocity: velocity = { x: 0, y: 0 };

  if (moveUp && !moveDown) {
    newTargetVelocity.y = -playerMaxSpeed;
  } else if (!moveUp && moveDown) {
    newTargetVelocity.y = playerMaxSpeed;
  }

  if (moveLeft && !moveRight) {
    newTargetVelocity.x = -playerMaxSpeed;
  } else if (!moveLeft && moveRight) {
    newTargetVelocity.x = playerMaxSpeed;
  }

  if (newTargetVelocity.y != 0 && newTargetVelocity.x != 0) {
    newTargetVelocity.y *= 0.7;
    newTargetVelocity.x *= 0.7;
  }

  player.targetVelocity = newTargetVelocity;
}

function spawnEnemy() {
  let radius = 20;

  let xPos: number;
  let yPos: number;

  if (Math.random() < 0.5) {
    xPos = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    yPos = Math.random() * canvas.height;
  } else {
    xPos = Math.random() * canvas.width;
    yPos = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
  }

  let colour = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`;

  enemies.push(new Enemy(xPos, yPos, radius, colour));
}

function updateProjectiles() {
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.draw();

    if (
      projectile.xPos + projectile.radius < 0 ||
      projectile.xPos - projectile.radius > canvas.width ||
      projectile.yPos + projectile.radius < 0 ||
      projectile.yPos - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
      }, 0);
    }
  });
}

function updateParticles() {
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0.01) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    } else {
      particle.draw();
    }
  });
}

function enemyHittingPlayer(enemy: Enemy) {
  const distance = Math.hypot(
    player.xPos - enemy.xPos,
    player.yPos - enemy.yPos
  );

  if (distance - enemy.radius - player.radius < 0) {
    cancelAnimationFrame(animationID);
    gameOverDisplay.style.display = "flex";
    finalScoreElement.innerHTML = score.toString();
    scoreDisplay.style.display = "none";
    removeEventListener("click", createProjectile);
    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
  }
}

function projectileHittingEnemy(enemy: Enemy, enemyIndex: number) {
  projectiles.forEach((projectile, projectileIndex) => {
    let distance = Math.hypot(
      projectile.xPos - enemy.xPos,
      projectile.yPos - enemy.yPos
    );

    if (distance - enemy.radius - projectile.radius < 0) {
      for (let i = 0; i < enemy.radius * 2; i++) {
        particles.push(
          new Particle(
            projectile.xPos,
            projectile.yPos,
            Math.random() * 2,
            enemy.colour,
            {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            }
          )
        );
      }

      if (enemy.minRadius >= 20) {
        enemy.minRadius -= 5;
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

function animate() {
  animationID = requestAnimationFrame(animate);

  if (animationID % fps == 0) {
    console.log(animationID);

    score += 1;
    scoreElement.innerHTML = score.toString();

    spawnEnemy();
  }

  playerKeyboardInput();

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  updateParticles();

  updateProjectiles();

  enemies.forEach((enemy, enemyIndex) => {
    enemy.draw();

    enemyHittingPlayer(enemy);

    projectileHittingEnemy(enemy, enemyIndex);
  });
}

startGameButton.addEventListener("click", () => {
  gameOverDisplay.style.display = "none";
  scoreDisplay.style.display = "block";
  init();
  animate();
  setTimeout(() => {
    addEventListener("click", createProjectile);
    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
  }, 0);
});
