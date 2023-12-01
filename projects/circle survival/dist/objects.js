"use strict";
class MovingObject {
    xPos;
    yPos;
    radius;
    colour;
    velocity;
    constructor(xPos, yPos, radius, colour) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.colour = colour;
        this.velocity = { x: 0, y: 0 };
    }
    draw() {
        this.update();
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }
    update() {
        this.xPos += this.velocity.x;
        this.yPos += this.velocity.y;
    }
}
class Player extends MovingObject {
    targetVelocity;
    constructor(xPos, yPos, radius, colour) {
        super(xPos, yPos, radius, colour);
        this.targetVelocity = this.velocity;
    }
    update() {
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
        if (this.xPos - this.radius < 0) {
            this.xPos = this.radius;
        }
        else if (this.xPos + this.radius > canvas.width) {
            this.xPos = canvas.width - this.radius;
        }
        if (this.yPos - this.radius < 0) {
            this.yPos = this.radius;
        }
        else if (this.yPos + this.radius > canvas.height) {
            this.yPos = canvas.height - this.radius;
        }
    }
}
class Enemy extends MovingObject {
    minRadius;
    speed;
    constructor(radius, speedMultiplier, colour) {
        let xPos;
        let yPos;
        if (Math.random() < 0.5) {
            xPos = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            yPos = Math.random() * canvas.height;
        }
        else {
            xPos = Math.random() * canvas.width;
            yPos = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        super(xPos, yPos, radius, colour);
        this.minRadius = this.radius;
        this.speed = enemyBaseSpeed * speedMultiplier;
    }
    update() {
        if (this.radius > this.minRadius) {
            this.radius -= 1;
        }
        let newAngle = Math.atan2(player.yPos - this.yPos, player.xPos - this.xPos);
        let newVelocity = {
            x: Math.cos(newAngle) * this.speed,
            y: Math.sin(newAngle) * this.speed,
        };
        this.velocity = newVelocity;
        this.xPos += this.velocity.x;
        this.yPos += this.velocity.y;
    }
}
class Projectile extends MovingObject {
    constructor(xPos, yPos, radius, colour, velocity) {
        super(xPos, yPos, radius, colour);
        this.velocity = velocity;
    }
}
class Particle extends Projectile {
    alpha;
    constructor(xPos, yPos, radius, colour, velocity) {
        super(xPos, yPos, radius, colour, velocity);
        this.alpha = 1;
    }
    draw() {
        this.update();
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.velocity.x *= particleFriction;
        this.velocity.y *= particleFriction;
        this.xPos += this.velocity.x;
        this.yPos += this.velocity.y;
        this.alpha -= 0.01;
    }
}
