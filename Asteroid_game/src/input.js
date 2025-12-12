// src/input.js
export const input = {
  left: false,
  right: false,
  up: false,
  down: false,
  shoot: false,
};

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      input.left = true; break;
    case 'ArrowRight':
    case 'KeyD':
      input.right = true; break;
    case 'ArrowUp':
    case 'KeyW':
      input.up = true; break;
    case 'ArrowDown':
    case 'KeyS':
      input.down = true; break;
    case 'Space':
      input.shoot = true; break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      input.left = false; break;
    case 'ArrowRight':
    case 'KeyD':
      input.right = false; break;
    case 'ArrowUp':
    case 'KeyW':
      input.up = false; break;
    case 'ArrowDown':
    case 'KeyS':
      input.down = false; break;
    case 'Space':
      input.shoot = false; break;
  }
});
