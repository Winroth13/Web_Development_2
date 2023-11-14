function createProjectile(event: MouseEvent) {
  let angle = Math.atan2(
    event.clientY - player.yPos,
    event.clientX - player.xPos
  );

  let velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) * projectileSpeed,
  };

  projectiles.push(
    new Projectile(player.xPos, player.yPos, 5, "white", velocity)
  );
}

function onKeyDown(event: KeyboardEvent) {
  if (!pressedKeys.includes(event.key)) {
    pressedKeys.push(event.key);
  }
}

function onKeyUp(event: KeyboardEvent) {
  pressedKeys.splice(pressedKeys.indexOf(event.key), 1);
}
