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
var MovingObject = /** @class */ (function () {
    function MovingObject(xPos, yPos, radius, colour) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.colour = colour;
        this.velocity = { x: 0, y: 0 };
    }
    MovingObject.prototype.draw = function () {
        this.update();
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
    };
    MovingObject.prototype.update = function () {
        this.xPos += this.velocity.x;
        this.yPos += this.velocity.y;
    };
    return MovingObject;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(xPos, yPos, radius, colour) {
        var _this = _super.call(this, xPos, yPos, radius, colour) || this;
        _this.targetVelocity = _this.velocity;
        return _this;
    }
    Player.prototype.update = function () {
        if (this.velocity.y < this.targetVelocity.y) {
            this.velocity.y += playerAcceleration;
        }
        else if (this.velocity.y > this.targetVelocity.y) {
            this.velocity.y -= playerAcceleration;
        }
        if (this.velocity.x < this.targetVelocity.x) {
            this.velocity.x += playerAcceleration;
        }
        else if (this.velocity.x > this.targetVelocity.x) {
            this.velocity.x -= playerAcceleration;
        }
        this.xPos += this.velocity.x;
        this.yPos += this.velocity.y;
    };
    return Player;
}(MovingObject));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(radius, speed, colour) {
        var _this = this;
        var xPos;
        var yPos;
        if (Math.random() < 0.5) {
            xPos = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            yPos = Math.random() * canvas.height;
        }
        else {
            xPos = Math.random() * canvas.width;
            yPos = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        _this = _super.call(this, xPos, yPos, radius, colour) || this;
        _this.minRadius = _this.radius;
        _this.speed = speed;
        return _this;
    }
    Enemy.prototype.update = function () {
        if (this.radius > this.minRadius) {
            this.radius -= 1;
        }
        var newAngle = Math.atan2(player.yPos - this.yPos, player.xPos - this.xPos);
        var newVelocity = {
            x: Math.cos(newAngle) * this.speed,
            y: Math.sin(newAngle) * this.speed,
        };
        this.velocity = newVelocity;
        this.xPos += this.velocity.x;
        this.yPos += this.velocity.y;
    };
    return Enemy;
}(MovingObject));
var Projectile = /** @class */ (function (_super) {
    __extends(Projectile, _super);
    function Projectile(xPos, yPos, radius, colour, velocity) {
        var _this = _super.call(this, xPos, yPos, radius, colour) || this;
        _this.velocity = velocity;
        return _this;
    }
    return Projectile;
}(MovingObject));
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    function Particle(xPos, yPos, radius, colour, velocity) {
        var _this = _super.call(this, xPos, yPos, radius, colour, velocity) || this;
        _this.alpha = 1;
        return _this;
    }
    Particle.prototype.draw = function () {
        this.update();
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.restore();
    };
    Particle.prototype.update = function () {
        this.velocity.x *= particleFriction;
        this.velocity.y *= particleFriction;
        this.xPos += this.velocity.x;
        this.yPos += this.velocity.y;
        this.alpha -= 0.01;
    };
    return Particle;
}(Projectile));
