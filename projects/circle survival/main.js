var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var scoreDisplay = document.querySelector("#scoreDisplay");
var scoreElement = document.querySelector("#scoreElement");
var gameOverDisplay = document.querySelector("#gameOverDisplay");
var startGameButton = document.querySelector("#startGameButton");
var finalScoreElement = document.querySelector("#finalScoreElement");
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var projectileSpeed = 5;
var playerMaxSpeed = 5;
var playerAcceleration = 0.5;
var enemnySpawnDelay = 1000;
var particleFriction = 0.98;
var enemySpeed = 2;
var fps = 60;
// const timePerFrame: number = 1000 / fps;
var player = new Player(centerX, centerY, 10, "white");
var projectiles = [];
var enemies = [];
var particles = [];
var pressedKeys = [];
var animationID;
var score;
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
function spawnEnemy() {
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
}
function updateProjectiles() {
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
function updateParticles() {
    particles.forEach(function (particle, index) {
        if (particle.alpha <= 0.01) {
            setTimeout(function () {
                particles.splice(index, 1);
            }, 0);
        }
        else {
            particle.draw();
        }
    });
}
function enemyHittingPlayer(enemy) {
    var distance = Math.hypot(player.xPos - enemy.xPos, player.yPos - enemy.yPos);
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
function projectileHittingEnemy(enemy, enemyIndex) {
    projectiles.forEach(function (projectile, projectileIndex) {
        var distance = Math.hypot(projectile.xPos - enemy.xPos, projectile.yPos - enemy.yPos);
        if (distance - enemy.radius - projectile.radius < 0) {
            for (var i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(projectile.xPos, projectile.yPos, Math.random() * 2, enemy.colour, {
                    x: (Math.random() - 0.5) * (Math.random() * 6),
                    y: (Math.random() - 0.5) * (Math.random() * 6),
                }));
            }
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
    enemies.forEach(function (enemy, enemyIndex) {
        enemy.draw();
        enemyHittingPlayer(enemy);
        projectileHittingEnemy(enemy, enemyIndex);
    });
}
startGameButton.addEventListener("click", function () {
    gameOverDisplay.style.display = "none";
    scoreDisplay.style.display = "block";
    init();
    animate();
    setTimeout(function () {
        addEventListener("click", createProjectile);
        addEventListener("keydown", onKeyDown);
        addEventListener("keyup", onKeyUp);
    }, 0);
});
