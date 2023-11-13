var MovingObject = /** @class */ (function () {
    function MovingObject(x, y, radius, colour, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.velocity = velocity;
    }
    MovingObject.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
    return MovingObject;
}());
