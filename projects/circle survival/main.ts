const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = innerWidth;
canvas.height = innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const projectileSpeed: number = 5;
const playerMaxSpeed: number = 5;
const player = new MovingObject(centerX, centerY, 10, "white", { x: 0, y: 0 });

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

  // let directionY: number;
  // let directionX: number;
  
  if (moveUp && !moveDown) {
    player.velocity.y = -playerMaxSpeed;
    // directionY = -1;
  } else if (!moveUp && moveDown) {
    player.velocity.y = playerMaxSpeed;
    // directionY = 1;
  } else {
    player.velocity.y = 0;
    // directionY = 0;
  }

  if (moveLeft && !moveRight) {
    player.velocity.x = -playerMaxSpeed;
    // directionX = -1;
  } else if (!moveLeft && moveRight) {
    player.velocity.x = playerMaxSpeed;
    // directionX = 1;
  } else {
    player.velocity.x = 0;
    // directionX = 0;
  }

  // let angle = Math.atan2(directionY, directionX)

  // let velocity = {
  //   x: Math.cos(angle) * projectileSpeed,
  //   y: Math.sin(angle) * projectileSpeed,
  // };

  // player.velocity = velocity
}

let animationID: number;
function animate() {
  animationID = requestAnimationFrame(animate);

  playerKeyboardInput();

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  projectilesOffScreen();

  console.log(pressedKeys);
}

function createProjectile(event: MouseEvent) {
  let angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);

  let velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) * projectileSpeed,
  };

  projectiles.push(new MovingObject(player.x, player.y, 5, "white", velocity));
}

addEventListener("click", createProjectile);
addEventListener("keydown", (event) => {
  if (!pressedKeys.includes(event.key)) {
    pressedKeys.push(event.key);
  }
});
addEventListener("keyup", (event) =>
  pressedKeys.splice(pressedKeys.indexOf(event.key), 1)
);

animate();
