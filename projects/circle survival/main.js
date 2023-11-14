var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var projectileSpeed = 5;
var playerMaxSpeed = 5;
var playerAcceleration = 0.5;
var enemnySpawnDelay = 1000;
var player = new Player(centerX, centerY, 10, "white");
var projectiles = [];
var enemies = [];
// let particles: Particle[] = [];
var pressedKeys = [];
function projectilesOffScreen() {
    projectiles.forEach(function (projectile, projectileIndex) {
        projectile.draw();
        if (projectile.xPos + projectile.radius < 0 ||
            projectile.xPos - projectile.radius > canvas.width ||
            projectile.yPos + projectile.radius < 0 ||
            projectile.yPos - projectile.radius > canvas.height) {
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
function enemyHittingPlayer(enemy) {
    var distance = Math.hypot(player.xPos - enemy.xPos, player.yPos - enemy.yPos);
    if (distance - enemy.radius - player.radius < 0) {
        cancelAnimationFrame(animationID);
    }
}
function enemyProjectileCollision(enemy, enemyIndex) {
    projectiles.forEach(function (projectile, projectileIndex) {
        var distance = Math.hypot(projectile.xPos - enemy.xPos, projectile.yPos - enemy.yPos);
        if (distance - enemy.radius - projectile.radius < 0) {
            if (enemy.minRadius >= 20) {
                enemy.minRadius -= 5;
            }
            else {
                setTimeout(function () {
                    enemies.splice(enemyIndex, 1);
                }, 0);
            }
            setTimeout(function () {
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }
    });
}
var animationID;
function animate() {
    animationID = requestAnimationFrame(animate);
    playerKeyboardInput();
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectilesOffScreen();
    enemies.forEach(function (enemy, enemyIndex) {
        enemy.draw();
        enemyHittingPlayer(enemy);
        enemyProjectileCollision(enemy, enemyIndex);
    });
}
function spawnEnemies() {
    setInterval(function () {
        var radius = 20;
        var xPos;
        var yPos;
        if (Math.random() < 0.5) {
            xPos = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            yPos = Math.random() * canvas.height;
        }
        else {
            xPos = Math.random() * canvas.width;
            yPos = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        }
        var colour = "hsl(".concat(Math.floor(Math.random() * 360), ", 50%, 50%)");
        enemies.push(new Enemy(xPos, yPos, radius, colour));
    }, enemnySpawnDelay);
}
addEventListener("click", createProjectile);
addEventListener("keydown", onKeyDown);
addEventListener("keyup", onKeyUp);
spawnEnemies();
animate();
