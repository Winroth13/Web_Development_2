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
    function MovingObject(x, y, radius, colour, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.velocity = velocity;
    }
    MovingObject.prototype.draw = function () {
        this.update();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
    };
    MovingObject.prototype.update = function () {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
    return MovingObject;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y, radius, colour, velocity) {
        var _this = _super.call(this, x, y, radius, colour, velocity) || this;
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
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
    return Player;
}(MovingObject));
