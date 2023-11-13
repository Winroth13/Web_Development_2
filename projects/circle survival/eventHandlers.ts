function createProjectile(event: MouseEvent) {
  let angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);

  let velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) * projectileSpeed,
  };

  projectiles.push(new MovingObject(player.x, player.y, 5, "white", velocity));
}

function onKeyDown(event: KeyboardEvent) {
  if (!pressedKeys.includes(event.key)) {
    pressedKeys.push(event.key);
  }
}

function onKeyUp(event: KeyboardEvent) {
  pressedKeys.splice(pressedKeys.indexOf(event.key), 1);
}
