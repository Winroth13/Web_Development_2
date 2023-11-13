var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var projectileSpeed = 5;
var playerMaxSpeed = 5;
var playerAcceleration = 0.5;
var player = new Player(centerX, centerY, 10, "white", { x: 0, y: 0 });
var projectiles = [];
var enemies = [];
// let particles: Particle[] = [];
var pressedKeys = [];
function projectilesOffScreen() {
    projectiles.forEach(function (projectile, projectileIndex) {
        projectile.draw();
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(function () {
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }
    });
}
function playerKeyboardInput() {
    var moveUp = pressedKeys.includes("w") || pressedKeys.includes("ArrowUp");
    var moveDown = pressedKeys.includes("s") || pressedKeys.includes("ArrowDown");
    var moveLeft = pressedKeys.includes("a") || pressedKeys.includes("ArrowLeft");
    var moveRight = pressedKeys.includes("d") || pressedKeys.includes("ArrowRight");
    var newTargetVelocity = { x: 0, y: 0 };
    if (moveUp && !moveDown) {
        newTargetVelocity.y = -playerMaxSpeed;
    }
    else if (!moveUp && moveDown) {
        newTargetVelocity.y = playerMaxSpeed;
    }
    if (moveLeft && !moveRight) {
        newTargetVelocity.x = -playerMaxSpeed;
    }
    else if (!moveLeft && moveRight) {
        newTargetVelocity.x = playerMaxSpeed;
    }
    if (newTargetVelocity.y != 0 && newTargetVelocity.x != 0) {
        newTargetVelocity.y *= 0.7;
        newTargetVelocity.x *= 0.7;
    }
    player.targetVelocity = newTargetVelocity;
}
var animationID;
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
