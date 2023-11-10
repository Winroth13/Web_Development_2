"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movingObject = void 0;
var movingObject = /** @class */ (function () {
    function movingObject(x, y, radius, colour, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.velocity = velocity;
    }
    return movingObject;
}());
exports.movingObject = movingObject;
