function createProjectile(event) {
    var angle = Math.atan2(event.clientY - player.yPos, event.clientX - player.xPos);
    var velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed,
    };
    projectiles.push(new Projectile(player.xPos, player.yPos, 5, "white", velocity));
}
function onKeyDown(event) {
    if (!pressedKeys.includes(event.key)) {
        pressedKeys.push(event.key);
        playerKeyboardInput();
    }
}
function onKeyUp(event) {
    pressedKeys.splice(pressedKeys.indexOf(event.key), 1);
    playerKeyboardInput();
}
function playerKeyboardInput() {
    var moveUp = pressedKeys.includes("w") || pressedKeys.includes("ArrowUp");
    var moveDown = pressedKeys.includes("s") || pressedKeys.includes("ArrowDown");
    var moveLeft = pressedKeys.includes("a") || pressedKeys.includes("ArrowLeft");
    var moveRight = pressedKeys.includes("d") || pressedKeys.includes("ArrowRight");
    if (pressedKeys.includes("q")) {
        openUpgradeMenu = !openUpgradeMenu;
        if (openUpgradeMenu == true) {
            pause();
        }
        else {
            unpause();
        }
    }
    if (pressedKeys.includes("Escape") && paused == false) {
        pause();
    }
    var newTargetVelocity = { x: 0, y: 0 };
    if (moveUp && !moveDown) {
        newTargetVelocity.y = -playerMaxSpeed;
    }
    else if (!moveUp && moveDown) {
        newTargetVelocity.y = playerMaxSpeed;
    }
    if (moveLeft && !moveRight) {
        newTargetVelocity.x = -playerMaxSpeed;
    }
    else if (!moveLeft && moveRight) {
        newTargetVelocity.x = playerMaxSpeed;
    }
    if (newTargetVelocity.y != 0 && newTargetVelocity.x != 0) {
        newTargetVelocity.y *= 0.7;
        newTargetVelocity.x *= 0.7;
    }
    player.targetVelocity = newTargetVelocity;
}
function pause() {
    cancelAnimationFrame(animationID);
    if (paused == false) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        removeEventListener("click", createProjectile);
    }
    if (openUpgradeMenu == false) {
        pauseDisplay.style.display = "block";
        addEventListener("click", unpause);
    }
    else {
        pauseDisplay.style.display = "none";
        upgradeDisplay.style.display = "flex";
        removeEventListener("click", unpause);
    }
    paused = true;
}
function unpause() {
    pauseDisplay.style.display = "none";
    upgradeDisplay.style.display = "none";
    removeEventListener("click", unpause);
    addEventListener("click", createProjectile);
    animate();
    paused = false;
}
