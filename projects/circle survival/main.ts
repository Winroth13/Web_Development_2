const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = innerWidth;
canvas.height = innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const projectileSpeed: number = 5;
const playerMaxSpeed: number = 5;
const playerAcceleration: number = 0.5;

const player = new Player(centerX, centerY, 10, "white", { x: 0, y: 0 });

let projectiles: MovingObject[] = [];
let enemies: MovingObject[] = [];
// let particles: Particle[] = [];

let pressedKeys: string[] = [];

function projectilesOffScreen() {
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.draw();

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

let animationID: number;
function animate() {
  animationID = requestAnimationFrame(animate);

  playerKeyboardInput();

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  projectilesOffScreen();
}

addEventListener("click", createProjectile);

addEventListener("keydown", onKeyDown);

addEventListener("keyup", onKeyUp);

animate();
