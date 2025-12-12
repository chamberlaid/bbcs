// src/main.js
import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { Game } from './game.js';

let scene, camera, renderer, clock, game;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000010);
  scene.fog = new THREE.FogExp2(0x000010, 0.03);

  // Camera – top-down-ish
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 30, 10); // high & slightly tilted
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Lights
// Brighter ambient light
const ambient = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambient);

// Stronger directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Optional: rim light from behind (makes cones & asteroids glow nicely)
const backLight = new THREE.DirectionalLight(0x66ccff, 1);
backLight.position.set(-10, 30, -20);
scene.add(backLight);


  // Starfield (purely visual)
  addStarfield();

  // Game logic
  game = new Game(scene, camera);

  clock = new THREE.Clock();

  window.addEventListener('resize', onWindowResize);
}

function addStarfield() {
  const starGeo = new THREE.BufferGeometry();
  const starCount = 800;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = -Math.random() * 200;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ size: 0.6, transparent: true, opacity: 0.8 });
window.starField = new THREE.Points(starGeo, mat);
scene.add(window.starField);

}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  if (game) {
    game.update(dt);
  }
// Scroll stars downward for parallax effect
if (window.starField) {
  const positions = window.starField.geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    positions.array[i * 3 + 2] += 20 * dt;  // move “down” towards player

    // Wrap-around when stars pass the camera
    if (positions.array[i * 3 + 2] > 10) {
      positions.array[i * 3 + 2] = -200 - Math.random() * 100;
    }
  }

  positions.needsUpdate = true;
}

  renderer.render(scene, camera);
}
