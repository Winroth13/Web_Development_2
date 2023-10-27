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
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var projectileSpeed = 5;
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
var player = new Player(centerX, centerY, 10, "white");
var projectiles = [];
var enemies = [];
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
var animationID;
function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    // Porjectiles flying off the screen
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
    // Enemy touching player
    enemies.forEach(function (enemy, enemyIndex) {
        enemy.update();
        var distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distance - enemy.radius - player.radius < 0) {
            cancelAnimationFrame(animationID);
        }
        // Enemy touching projectile
        projectiles.forEach(function (projectile, projectileIndex) {
            var distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (distance - enemy.radius - projectile.radius < 0) {
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
    });
}
addEventListener("click", function (event) {
    var angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    var velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed,
    };
    projectiles.push(new Projectile(centerX, centerY, 5, "white", velocity));
});
animate();
spawnEnemies();
// https://www.youtube.com/watch?v=eI9idPTT0c4
