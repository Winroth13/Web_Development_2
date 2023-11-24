var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var scoreDisplay = document.querySelector("#scoreDisplay");
var scoreElement = document.querySelector("#scoreElement");
var gameOverDisplay = document.querySelector("#gameOverDisplay");
var startGameButton = document.querySelector("#startGameButton");
var finalScoreElement = document.querySelector("#finalScoreElement");
var pauseDisplay = document.querySelector("#pauseDisplay");
var progressDusplay = document.querySelector("#progressDisplay");
var experienceBar = document.querySelector("#experienceBar");
var upgradeMessage = document.querySelector("#upgradeMessage");
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var projectileSpeed = 5;
var playerMaxSpeed = 5;
var playerAcceleration = 0.5;
var particleFriction = 0.98;
var enemySpeed = 2;
var fps = 60;
var experiencePerKill = 5;
var player = new Player(centerX, centerY, 10, "white");
var projectiles = [];
var enemies = [];
var particles = [];
var pressedKeys = [];
var animationID;
var score;
var enemySpawnDelay;
var experiencePoints = 0;
function init() {
    player.xPos = centerX;
    player.yPos = centerY;
    player.velocity = { x: 0, y: 0 };
    animationID = 0;
    enemySpawnDelay = 2 * fps;
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreElement.innerHTML = score.toString();
}
function spawnEnemy() {
    var newEnemy;
    if (Math.random() > score / 100) {
        newEnemy = new Enemy(20, 2, "red");
    }
    else {
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
    enemies.push(newEnemy);
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
        removeEventListener("keydown", onKeyDown);
        removeEventListener("blur", pause);
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
                updateExperience(experiencePoints + experiencePerKill);
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
function updateExperience(value) {
    experiencePoints = value;
    experienceBar.setAttribute("value", experiencePoints.toString());
}
function animate() {
    animationID = requestAnimationFrame(animate);
    if (animationID % fps == 0) {
        score += 1;
        scoreElement.innerHTML = score.toString();
    }
    if (animationID % enemySpawnDelay == 0) {
        enemySpawnDelay = Math.round(enemySpawnDelay * 0.98);
        console.log(enemySpawnDelay);
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
    progressDusplay.style.display = "flex";
    init();
    animate();
    setTimeout(function () {
        addEventListener("click", createProjectile);
        addEventListener("keydown", onKeyDown);
        addEventListener("keyup", onKeyUp);
        addEventListener("blur", pause);
    }, 0);
});
