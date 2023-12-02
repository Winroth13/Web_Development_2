const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = innerWidth;
canvas.height = innerHeight;

const statDisplay = document.querySelector<HTMLElement>("#statDisplay")!;
const scoreElement = document.querySelector("#scoreElement")!;
const lifeElement = document.querySelector("#lifeElement")!;

const gameOverDisplay =
  document.querySelector<HTMLElement>("#gameOverDisplay")!;
const startGameButton = document.querySelector("#startGameButton")!;
const finalScoreElement = document.querySelector("#finalScoreElement")!;
const pauseDisplay = document.querySelector<HTMLElement>("#pauseDisplay")!;

const progressDisplay =
  document.querySelector<HTMLElement>("#progressDisplay")!;
const experienceBar = document.querySelector("#experienceBar")!;
const upgradeMessage = document.querySelector<HTMLElement>("#upgradeMessage")!;

const upgradeDisplay = document.querySelector<HTMLElement>("#upgradeDisplay")!;
const upgradeOptions = document.querySelector<HTMLElement>("#upgradeOptions")!;

const scoreboardDisplay =
  document.querySelector<HTMLElement>("#scoreboardDisplay")!;
const scoreboardTable =
  document.querySelector<HTMLElement>("#scoreboardTable")!;

const controlsDisplay =
  document.querySelector<HTMLElement>("#controlsDisplay")!;

const aliasInput = document.querySelector("#aliasInput")!;

const standardResolution: number = 1080 * 1920;
const widnowResuliton: number = canvas.height * canvas.width;

const screenSizeMultiplier: number = widnowResuliton / standardResolution;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const projectileSpeed: number = 7 * screenSizeMultiplier;
const playerMaxSpeed: number = 5 * screenSizeMultiplier;
const playerAcceleration: number = 0.5 * screenSizeMultiplier;
const particleFriction: number = 0.98;
const enemyBaseSpeed: number = 2 * screenSizeMultiplier;
const particleSpeed: number = 6 * screenSizeMultiplier;

const fps: number = 60;

let startingExperiencePerLevel: number = 10;
const experiencePerLevelMultiplier: number = 1.5;

let experiencePerKill = { number: 5 };
let projectileDamage = { number: 5 };
let startingLives: number = 3;
let lives = { number: startingLives };
let superiority = { number: 0 };

const upgrades: upgrade[] = [
  {
    name: "Deadlier Projectiles",
    description: "Damage Per Hit",
    variable: projectileDamage,
    amount: 1,
  },
  {
    name: "Insert Name",
    description: "Current Lives",
    variable: lives,
    amount: 1,
    function: "updateLife()",
  },
  {
    name: "Faster Learning",
    description: "Experience Per Kill",
    variable: experiencePerKill,
    amount: 1,
  },
  {
    name: "Superiority Complex",
    description: "Superiority Feeling",
    variable: superiority,
    amount: 1,
  },
];

const player = new Player(centerX, centerY, 10, "white");

let projectiles: Projectile[] = [];
let enemies: Enemy[] = [];
let particles: Particle[] = [];

let pressedKeys: string[] = [];

let animationID: number;
let animationIntervalID: number;
let score: number;
let enemySpawnDelay: number;
let experiencePoints: number;
let experiencePerLevel: number;

let openUpgradeMenu: boolean = false;
let paused: boolean = false;

let highScoreList: highScore[];

function init() {
  player.xPos = centerX;
  player.yPos = centerY;
  player.velocity = { x: 0, y: 0 };

  animationID = 0;
  enemySpawnDelay = 2 * fps;

  projectiles = [];
  enemies = [];
  particles = [];

  experiencePerKill.number = 5;
  projectileDamage.number = 5;
  superiority.number = 0;

  lives.number = startingLives;

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
  let newEnemy: Enemy;

  if (Math.random() > score / 100) {
    newEnemy = new Enemy(20, 1, "red");
  } else {
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

function endGame() {
  clearInterval(animationIntervalID);
  gameOverDisplay.style.display = "flex";
  scoreboardDisplay.style.display = "flex";
  controlsDisplay.style.display = "flex";
  statDisplay.style.display = "none";
  progressDisplay.style.display = "none";

  finalScoreElement.innerHTML = score.toString();

  removeEventListener("click", createProjectile);
  removeEventListener("keydown", onKeyDown);
  removeEventListener("blur", pause);

  // @ts-ignore
  let highScore: highScore = { name: aliasInput.value, score: score };

  highScoreList.push(highScore);

  highScoreList.sort((a, b) => {
    return b.score - a.score;
  });

  localStorage.setItem("highScores", JSON.stringify(highScoreList));

  updateHighscores();
}

function enemyHittingPlayer(enemy: Enemy, enemyIndex: number) {
  const distance = Math.hypot(
    player.xPos - enemy.xPos,
    player.yPos - enemy.yPos
  );

  if (distance - enemy.radius - player.radius < 0) {
    lives.number--;

    updateLife();

    if (lives.number == 0) {
      endGame();
    } else {
      setTimeout(() => {
        enemies.splice(enemyIndex, 1);
      }, 0);
    }
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
              x: (Math.random() - 0.5) * (Math.random() * particleSpeed),
              y: (Math.random() - 0.5) * (Math.random() * particleSpeed),
            }
          )
        );
      }

      if (enemy.minRadius >= 20) {
        enemy.minRadius -= projectileDamage.number;
      } else {
        updateExperience(experiencePoints + experiencePerKill.number);

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

function updateExperience(value: number) {
  experiencePoints = value;

  experienceBar.setAttribute("value", experiencePoints.toString());

  if (experiencePoints >= experiencePerLevel) {
    upgradeMessage.style.display = "block";
  } else {
    upgradeMessage.style.display = "none";
  }
}

function updateScore() {
  scoreElement.innerHTML = "Score: " + score.toString();
}

function updateLife() {
  lifeElement.innerHTML = "Lives: " + lives.number.toString();
}

function updateExperienceBar() {
  experienceBar.setAttribute("max", experiencePerLevel.toString());
}

function startAnimation() {
  animationIntervalID = setInterval(() => {
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

  enemies.forEach((enemy, enemyIndex) => {
    enemy.draw();

    enemyHittingPlayer(enemy, enemyIndex);

    projectileHittingEnemy(enemy, enemyIndex);
  });
}

function newElement(parent: HTMLElement, tag: string, text: string) {
  let element = document.createElement(tag);
  let elementText = document.createTextNode(text);

  element.appendChild(elementText);
  parent.appendChild(element);

  return element;
}

function newUpgrades() {
  let upgrade: upgrade;
  let upgradeSelection: upgrade[] = [];

  while (upgradeOptions.hasChildNodes()) {
    upgradeOptions.removeChild(upgradeOptions.lastChild!);
  }

  for (let i = 0; i < 3; i++) {
    upgrade = upgrades[Math.floor(Math.random() * upgrades.length)];

    while (upgradeSelection.includes(upgrade)) {
      upgrade = upgrades[Math.floor(Math.random() * upgrades.length)];
    }

    upgradeSelection.push(upgrade);

    let div = document.createElement("div");

    newElement(div, "h2", upgrade.name);
    newElement(div, "p", upgrade.description);
    newElement(
      div,
      "p",
      upgrade.variable.number +
        " => " +
        (upgrade.variable.number + upgrade.amount)
    );
    let button = newElement(div, "button", "Select");

    upgradeOptions.appendChild(div);

    button.id = upgrade.name.replace(/\s/g, "");

    let buttonElement = document.querySelector("#" + button.id)!;

    buttonElement.addEventListener("click", () => {
      if (experiencePoints >= experiencePerLevel) {
        updateExperience(experiencePoints - experiencePerLevel);

        experiencePerLevel *= experiencePerLevelMultiplier;

        updateExperienceBar();

        let upgrade = upgradeSelection.find(
          (upgrade) => upgrade.name.replace(/\s/g, "") == buttonElement.id
        )!;

        upgrade.variable.number += upgrade.amount;

        if (upgrade.function != undefined) {
          eval(upgrade.function);
        }

        newUpgrades();
      }
    });
  }
}

function updateHighscores() {
  let highScore: highScore;

  while (scoreboardTable.hasChildNodes()) {
    scoreboardTable.removeChild(scoreboardTable.lastChild!);
  }

  for (let i = 0; i < 5; i++) {
    if (highScoreList.length > i) {
      highScore = highScoreList[i];
    } else {
      highScore = {
        name: "-",
        score: 0,
      };
    }
    let tableRow = document.createElement("tr");

    newElement(tableRow, "th", highScore.name);
    newElement(tableRow, "th", highScore.score.toString());

    scoreboardTable.appendChild(tableRow);
  }
}

startGameButton.addEventListener("click", () => {
  // @ts-ignore
  if (aliasInput.value == "") {
    alert("Username is required.");
    // @ts-ignore
  } else if (aliasInput.value.length > 12) {
    alert("Username cannot be longer than 12 characters.");
  } else {
    gameOverDisplay.style.display = "none";
    scoreboardDisplay.style.display = "none";
    controlsDisplay.style.display = "none";
    statDisplay.style.display = "block";
    progressDisplay.style.display = "flex";

    init();

    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
    addEventListener("blur", pause);

    setTimeout(() => {
      addEventListener("click", createProjectile);
    });
  }
});

highScoreList = JSON.parse(localStorage.getItem("highScores")!);

if (highScoreList == null) {
  highScoreList = [];
}

updateHighscores();
