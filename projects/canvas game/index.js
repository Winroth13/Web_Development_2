var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var particleFriction = 0.98;
var Player = /** @class */ (function () {
    function Player(x, y, radius, colour) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
    }
    Player.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
    };
    return Player;
}());
var Projectile = /** @class */ (function (_super) {
    __extends(Projectile, _super);
    function Projectile(x, y, radius, colour, velocity) {
        var _this = _super.call(this, x, y, radius, colour) || this;
        _this.velocity = velocity;
        return _this;
    }
    Projectile.prototype.update = function () {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
    return Projectile;
}(Player));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, radius, colour, velocity) {
        var _this = _super.call(this, x, y, radius, colour, velocity) || this;
        _this.minRadius = _this.radius;
        return _this;
    }
    Enemy.prototype.update = function () {
        if (this.radius > this.minRadius) {
            this.radius -= 1;
        }
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
    return Enemy;
}(Projectile));
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    function Particle(x, y, radius, colour, velocity) {
        var _this = _super.call(this, x, y, radius, colour, velocity) || this;
        _this.alpha = 1;
        return _this;
    }
    Particle.prototype.draw = function () {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.restore();
    };
    Particle.prototype.update = function () {
        this.draw();
        this.velocity.x *= particleFriction;
        this.velocity.y *= particleFriction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    };
    return Particle;
}(Projectile));
var player = new Player(centerX, centerY, 10, "white");
var projectiles = [];
var enemies = [];
var particles = [];
// Whenever a new game starts
function inti() {
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreElement.innerHTML = score.toString();
}
function spawnEnemies() {
    setInterval(function () {
        var radius = 10 + Math.random() * 20;
        var x;
        var y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        }
        var colour = "hsl(".concat(Math.floor(Math.random() * 360), ", 50%, 50%)");
        var angle = Math.atan2(centerY - y, centerX - x);
        var velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        enemies.push(new Enemy(x, y, radius, colour, velocity));
    }, 1000);
}
function updateParticles() {
    particles.forEach(function (particle, index) {
        particle.update();
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
}
function projectilesOffScreen() {
    projectiles.forEach(function (projectile, projectileIndex) {
        projectile.update();
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
function enemyHittingPlayer(enemy) {
    var distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // End game
    if (distance - enemy.radius - player.radius < 0) {
        cancelAnimationFrame(animationID);
        gameOverDisplay.style.display = "flex";
        finalScoreElement.innerHTML = score.toString();
        scoreDisplay.style.display = "none";
        removeEventListener("click", createProjectile);
    }
}
function enemyProjectileCollision(enemy, enemyIndex) {
    projectiles.forEach(function (projectile, projectileIndex) {
        var distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        if (distance - enemy.radius - projectile.radius < 0) {
            //Increase score
            score += 1;
            scoreElement.innerHTML = score.toString();
            //Create explosion
            for (var i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.colour, {
                    x: (Math.random() - 0.5) * (Math.random() * 6),
                    y: (Math.random() - 0.5) * (Math.random() * 6),
                }));
            }
            // Shrink enemy
            if (enemy.minRadius > 20) {
                enemy.minRadius -= 10;
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
var score = 0;
function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    // Particles
    updateParticles();
    // Porjectiles flying off the screen
    projectilesOffScreen();
    // Alla enemies
    enemies.forEach(function (enemy, enemyIndex) {
        enemy.update();
        // Enemy hitting player
        enemyHittingPlayer(enemy);
        // Enemy touching projectile
        enemyProjectileCollision(enemy, enemyIndex);
    });
}
function createProjectile(event) {
    var angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    console.log("object");
    var velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed,
    };
    projectiles.push(new Projectile(centerX, centerY, 5, "white", velocity));
}
startGameButton.addEventListener("click", function () {
    gameOverDisplay.style.display = "none";
    scoreDisplay.style.display = "block";
    inti();
    animate();
    spawnEnemies();
    setTimeout(function () {
        addEventListener("click", createProjectile);
    }, 0);
});
