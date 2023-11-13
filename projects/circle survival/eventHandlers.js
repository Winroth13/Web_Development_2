function createProjectile(event) {
    var angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    var velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed,
    };
    projectiles.push(new MovingObject(player.x, player.y, 5, "white", velocity));
}
function onKeyDown(event) {
    if (!pressedKeys.includes(event.key)) {
        pressedKeys.push(event.key);
    }
}
function onKeyUp(event) {
    pressedKeys.splice(pressedKeys.indexOf(event.key), 1);
}
