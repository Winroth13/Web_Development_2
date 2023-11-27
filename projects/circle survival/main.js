var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var statDisplay = document.querySelector("#statDisplay");
var scoreElement = document.querySelector("#scoreElement");
var lifeElement = document.querySelector("#lifeElement");
var gameOverDisplay = document.querySelector("#gameOverDisplay");
var startGameButton = document.querySelector("#startGameButton");
var finalScoreElement = document.querySelector("#finalScoreElement");
var pauseDisplay = document.querySelector("#pauseDisplay");
var progressDisplay = document.querySelector("#progressDisplay");
var experienceBar = document.querySelector("#experienceBar");
var upgradeMessage = document.querySelector("#upgradeMessage");
var upgradeDisplay = document.querySelector("#upgradeDisplay");
var upgradeOptions = document.querySelector("#upgradeOptions");
var aliasInput = document.querySelector("#aliasInput");
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var projectileSpeed = 5;
var playerMaxSpeed = 5;
var playerAcceleration = 0.5;
var particleFriction = 0.98;
var enemyBaseSpeed = 2;
var fps = 60;
var startingExperiencePerLevel = 10;
var experiencePerLevelMultiplier = 1.5;
var experiencePerKill = 5;
var projectileDamage = 5;
var startingLives = 3;
var lives = startingLives;
var superiority = 0;
var upgrades = [
    {
        name: "Deadlier Projectiles",
        description: "Damage Per Hit",
        variable: "projectileDamage",
        amount: 1,
    },
    {
        name: "Insert Name",
        description: "Current Lives",
        variable: "lives",
        amount: 1,
        function: "updateLife()",
    },
    {
        name: "Faster Learning",
        description: "Experience Per Kill",
        variable: "experiencePerKill",
        amount: 1,
    },
    {
        name: "Superiority Complex",
        description: "Superiority Feeling",
        variable: "superiority",
        amount: 1,
    },
];
var player = new Player(centerX, centerY, 10, "white");
var projectiles = [];
var enemies = [];
var particles = [];
var pressedKeys = [];
var animationID;
var animationIntervalID;
var score;
var enemySpawnDelay;
var experiencePoints;
var experiencePerLevel;
var openUpgradeMenu = false;
var paused = false;
function init() {
    player.xPos = centerX;
    player.yPos = centerY;
    player.velocity = { x: 0, y: 0 };
    animationID = 0;
    enemySpawnDelay = 2 * fps;
    projectiles = [];
    enemies = [];
    particles = [];
    lives = startingLives;
    updateLife();
    score = 0;
    updateScore();
    experiencePerLevel = startingExperiencePerLevel;
    updateExperienceBar();
    updateExperience(0);
    newUpgrades();
    startAnimation();
}
function spawnEnemy() {
    var newEnemy;
    if (Math.random() > score / 100) {
        newEnemy = new Enemy(20, 1, "red");
    }
    else {
        switch (Math.floor(Math.random() * 3 + 1)) {
            case 1:
                newEnemy = new Enemy(40, 0.5, "orange");
                break;
            case 2:
                newEnemy = new Enemy(15, 2.5, "blue");
                break;
            case 3:
                newEnemy = new Enemy(25, 1, "yellow");
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
function enemyHittingPlayer(enemy, enemyIndex) {
    var distance = Math.hypot(player.xPos - enemy.xPos, player.yPos - enemy.yPos);
    if (distance - enemy.radius - player.radius < 0) {
        lives--;
        updateLife();
        if (lives == 0) {
            clearInterval(animationIntervalID);
            gameOverDisplay.style.display = "flex";
            finalScoreElement.innerHTML = score.toString();
            statDisplay.style.display = "none";
            removeEventListener("click", createProjectile);
            removeEventListener("keydown", onKeyDown);
            removeEventListener("blur", pause);
        }
        else {
            setTimeout(function () {
                enemies.splice(enemyIndex, 1);
            }, 0);
        }
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
                enemy.minRadius -= projectileDamage;
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
    if (experiencePoints >= experiencePerLevel) {
        upgradeMessage.style.display = "block";
    }
    else {
        upgradeMessage.style.display = "none";
    }
}
function updateScore() {
    scoreElement.innerHTML = "Score: " + score.toString();
}
function updateLife() {
    lifeElement.innerHTML = "Lives: " + lives.toString();
}
function updateExperienceBar() {
    experienceBar.setAttribute("max", experiencePerLevel.toString());
}
function startAnimation() {
    animationIntervalID = setInterval(function () {
        animationID = requestAnimationFrame(animate);
    }, 1000 / fps);
}
function animate() {
    if (animationID % fps == 0) {
        score += 1;
        updateScore();
    }
    if (animationID % enemySpawnDelay == 0) {
        enemySpawnDelay = Math.round(enemySpawnDelay * 0.98);
        spawnEnemy();
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    updateParticles();
    updateProjectiles();
    enemies.forEach(function (enemy, enemyIndex) {
        enemy.draw();
        enemyHittingPlayer(enemy, enemyIndex);
        projectileHittingEnemy(enemy, enemyIndex);
    });
}
function newElement(parent, tag, text) {
    var element = document.createElement(tag);
    var elementText = document.createTextNode(text);
    element.appendChild(elementText);
    parent.appendChild(element);
    return element;
}
function newUpgrades() {
    var upgrade;
    var upgradeSelection = [];
    while (upgradeOptions.hasChildNodes()) {
        upgradeOptions.removeChild(upgradeOptions.lastChild);
    }
    var _loop_1 = function (i) {
        upgrade = upgrades[Math.floor(Math.random() * upgrades.length)];
        while (upgradeSelection.includes(upgrade)) {
            upgrade = upgrades[Math.floor(Math.random() * upgrades.length)];
        }
        upgradeSelection.push(upgrade);
        var div = document.createElement("div");
        newElement(div, "h2", upgrade.name);
        newElement(div, "p", upgrade.description);
        newElement(div, "p", window[upgrade.variable] +
            " => " +
            Number(window[upgrade.variable] + upgrade.amount));
        var button = newElement(div, "button", "Select");
        upgradeOptions.appendChild(div);
        button.id = upgrade.variable;
        var buttonElement = document.querySelector("#" + button.id);
        buttonElement.addEventListener("click", function () {
            if (experiencePoints >= experiencePerLevel) {
                updateExperience(experiencePoints - experiencePerLevel);
                experiencePerLevel *= experiencePerLevelMultiplier;
                updateExperienceBar();
                var upgrade_1 = upgradeSelection.find(function (upgrade) { return upgrade.variable == buttonElement.id; });
                window[upgrade_1.variable] += upgrade_1.amount;
                if (upgrade_1.function != undefined) {
                    eval(upgrade_1.function);
                }
                newUpgrades();
            }
        });
    };
    for (var i = 0; i < 3; i++) {
        _loop_1(i);
    }
}
startGameButton.addEventListener("click", function () {
    if (aliasInput.value == "") {
        alert("Username is required");
    }
    else {
        gameOverDisplay.style.display = "none";
        statDisplay.style.display = "block";
        progressDisplay.style.display = "flex";
        init();
        addEventListener("click", createProjectile);
        addEventListener("keydown", onKeyDown);
        addEventListener("keyup", onKeyUp);
        addEventListener("blur", pause);
    }
});
