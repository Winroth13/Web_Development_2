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
const pauseDisplay = document.querySelector<HTMLElement>("#pauseDisplay")!;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const projectileSpeed: number = 5;
const playerMaxSpeed: number = 5;
const playerAcceleration: number = 0.5;
const enemnySpawnDelay: number = 1000;
const particleFriction: number = 0.98;
const enemySpeed: number = 2;

const fps: number = 60;

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

function spawnEnemy() {
  let newEnemy: Enemy;

  if (Math.random() > score / 100) {
    newEnemy = new Enemy(20, 2, "red");
  } else {
    switch (Math.floor(Math.random() * 3 + 1)) {
      case 1:
        newEnemy = new Enemy(40, 1, "orange");
        break;
      case 2:
        newEnemy = new Enemy(15, 5, "blue");
        break;
      case 3:
        newEnemy = new Enemy(25, 2, "yellow");
    }
  }

  enemies.push(newEnemy!);
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
    removeEventListener("keydown", onKeyDown);
    removeEventListener("blur", pause);
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
    addEventListener("blur", pause);
  }, 0);
});
