// src/game.js
import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { Player } from './entities/player.js';
import { Bullet } from './entities/bullet.js';
import { Asteroid } from './entities/asteroid.js';
import { input } from './input.js';

export class Game {
	constructor(scene, camera) {
		this.scene = scene;
		this.camera = camera;

		this.player = new Player(scene);
		this.bullets = [];
		this.asteroids = [];
		this.particles = [];

		this.spawnTimer = 0;
		this.spawnInterval = 0.9;

		this.score = 0;
		this.lives = 3;

		this.hitCooldown = 0;
		this.hitCooldownTime = 0.3;

		this.shakeTime = 0;
		this.shakeStrength = 0;

		this.gameOver = false;

		this.scoreEl = document.getElementById('score');
		this.livesEl = document.getElementById('lives');

		this.overlay = null;
		this.overlayScoreEl = null;
		this.createGameOverOverlay();

		this.prevRestartPressed = false;

		this.updateUI();
	}

	createGameOverOverlay() {
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.left = '0';
		overlay.style.top = '0';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.display = 'none';
		overlay.style.alignItems = 'center';
		overlay.style.justifyContent = 'center';
		overlay.style.background = 'rgba(0, 0, 0, 0.65)';
		overlay.style.zIndex = '9999';
		overlay.style.fontFamily = "'Outfit', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
		overlay.style.color = '#ffffff';
		overlay.style.textAlign = 'center';

		const panel = document.createElement('div');
		panel.style.padding = '26px 30px';
		panel.style.border = '1px solid rgba(255,255,255,0.18)';
		panel.style.borderRadius = '14px';
		panel.style.background = 'rgba(0,0,0,0.35)';
		panel.style.backdropFilter = 'blur(8px)';
		panel.style.minWidth = '280px';

		const title = document.createElement('div');
		title.textContent = 'game over';
		title.style.fontSize = '28px';
		title.style.fontWeight = '600';
		title.style.letterSpacing = '0.6px';
		title.style.marginBottom = '10px';

		const scoreLine = document.createElement('div');
		scoreLine.style.fontSize = '16px';
		scoreLine.style.opacity = '0.9';
		scoreLine.style.marginBottom = '16px';
		scoreLine.innerHTML = 'score: <span id="go-score">0</span>';

		const hint = document.createElement('div');
		hint.textContent = 'press r to restart';
		hint.style.fontSize = '12px';
		hint.style.opacity = '0.7';
		hint.style.letterSpacing = '0.3px';

		panel.appendChild(title);
		panel.appendChild(scoreLine);
		panel.appendChild(hint);
		overlay.appendChild(panel);
		document.body.appendChild(overlay);

		this.overlay = overlay;
		this.overlayScoreEl = scoreLine.querySelector('#go-score');
	}

	showGameOver() {
		if (this.overlayScoreEl) {
			this.overlayScoreEl.textContent = String(this.score);
		}
		if (this.overlay) {
			this.overlay.style.display = 'flex';
		}
	}

	hideGameOver() {
		if (this.overlay) {
			this.overlay.style.display = 'none';
		}
	}

	addShake(strength, time) {
		this.shakeStrength = Math.max(this.shakeStrength, strength);
		this.shakeTime = Math.max(this.shakeTime, time);
	}

	spawnExplosion(pos, baseSize = 1) {
		const count = 18 + Math.floor(Math.random() * 10);
		for (let i = 0; i < count; i++) {
			const geo = new THREE.SphereGeometry(0.08 * baseSize, 8, 8);
			const mat = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				emissive: 0x66ccff,
				emissiveIntensity: 1.6,
				transparent: true,
				opacity: 1,
			});
			const m = new THREE.Mesh(geo, mat);
			m.position.copy(pos);

			const v = new THREE.Vector3(
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 2,
				(Math.random() - 0.5) * 10
			).multiplyScalar(0.6 * baseSize);

			this.scene.add(m);
			this.particles.push({
				mesh: m,
				vel: v,
				life: 0.5 + Math.random() * 0.4,
				maxLife: 0.9,
			});
		}
	}

	updateParticles(dt) {
		this.particles = this.particles.filter(p => {
			p.life -= dt;
			p.mesh.position.addScaledVector(p.vel, dt);
			p.vel.multiplyScalar(0.94);

			const t = Math.max(0, p.life / p.maxLife);
			p.mesh.material.opacity = t;

			if (p.life <= 0) {
				this.scene.remove(p.mesh);
				return false;
			}
			return true;
		});
	}

	update(dt) {
		let shakeX = 0;
		let shakeZ = 0;
		if (this.shakeTime > 0) {
			this.shakeTime -= dt;
			const s = this.shakeStrength * (this.shakeTime / Math.max(0.001, this.shakeTime + dt));
			shakeX = (Math.random() - 0.5) * s;
			shakeZ = (Math.random() - 0.5) * s;
		} else {
			this.shakeStrength = 0;
		}

		const targetX = this.player.mesh.position.x * 0.2;
		this.camera.position.x += (targetX - this.camera.position.x) * 0.1;
		this.camera.position.y = 30;
		this.camera.position.z = 10;
		this.camera.position.x += shakeX;
		this.camera.position.z += shakeZ;
		this.camera.lookAt(0, 0, 0);

		if (this.hitCooldown > 0) this.hitCooldown -= dt;

		this.updateParticles(dt);

		const restartPressed = !!input.restart;
		if (this.gameOver) {
			if (restartPressed && !this.prevRestartPressed) {
				this.restart();
			}
			this.prevRestartPressed = restartPressed;
			this.updateUI();
			return;
		}

		this.player.update(dt, input);
		if (input.shoot && this.player.canShoot()) {
			this.player.shoot();
			this.spawnBullet();
		}

		this.spawnTimer -= dt;
		if (this.spawnTimer <= 0) {
			this.spawnTimer = this.spawnInterval;
			this.spawnAsteroid();
			this.spawnInterval = Math.max(0.3, this.spawnInterval - 0.001);
		}

		for (const b of this.bullets) b.update(dt);
		this.bullets = this.cleanup(this.bullets);

		for (const a of this.asteroids) a.update(dt);
		this.asteroids = this.cleanup(this.asteroids);

		this.handleCollisions();

		this.prevRestartPressed = restartPressed;
		this.updateUI();
	}

	restart() {
		for (const b of this.bullets) b.destroy(this.scene);
		for (const a of this.asteroids) a.destroy(this.scene);
		this.bullets = [];
		this.asteroids = [];

		this.player.destroy(this.scene);

		this.score = 0;
		this.lives = 3;
		this.spawnTimer = 0;
		this.spawnInterval = 0.9;
		this.hitCooldown = 0;
		this.gameOver = false;

		this.player = new Player(this.scene);

		this.hideGameOver();
		this.updateUI();
	}

	spawnBullet() {
		const pos = this.player.getPosition();
		pos.z -= 1.5;
		const b = new Bullet(this.scene, pos);
		this.bullets.push(b);
	}

	spawnAsteroid() {
		const a = new Asteroid(this.scene);
		this.asteroids.push(a);
	}

	cleanup(list) {
		return list.filter(o => {
			if (!o.alive) {
				o.destroy(this.scene);
				return false;
			}
			return true;
		});
	}

	handleCollisions() {
		if (!this.player.alive) return;

		for (const b of this.bullets) {
			if (!b.alive) continue;
			for (const a of this.asteroids) {
				if (!a.alive) continue;
				if (this.sphereCollision(
					b.mesh.position, b.radius,
					a.mesh.position, a.radius
				)) {
					b.alive = false;
					a.alive = false;
					this.score += 10;
					this.spawnExplosion(a.mesh.position, Math.max(0.8, a.radius * 0.6));
					this.addShake(0.25, 0.12);
					break;
				}
			}
		}

		if (this.hitCooldown > 0) return;

		const pPos = this.player.mesh.position;
		const pRadius = 1;

		for (const a of this.asteroids) {
			if (!a.alive) continue;
			if (this.sphereCollision(
				pPos, pRadius,
				a.mesh.position, a.radius
			)) {
				a.alive = false;
				this.hitCooldown = this.hitCooldownTime;
				this.lives = Math.max(0, this.lives - 1);
				this.spawnExplosion(pPos, 1.1);
				this.addShake(0.6, 0.2);
				this.player.takeDamage(1, this.scene);

				if (this.lives === 0) {
					this.spawnExplosion(pPos, 2.2);
					this.addShake(1.2, 0.35);
					this.gameOver = true;
					this.showGameOver();
				}
				break;
			}
		}
	}

	sphereCollision(posA, rA, posB, rB) {
		const dx = posA.x - posB.x;
		const dy = posA.y - posB.y;
		const dz = posA.z - posB.z;
		const distSq = dx * dx + dy * dy + dz * dz;
		const r = rA + rB;
		return distSq <= r * r;
	}

	updateUI() {
		if (this.scoreEl) this.scoreEl.textContent = this.score;
		if (this.livesEl) this.livesEl.textContent = this.lives;
	}
}
