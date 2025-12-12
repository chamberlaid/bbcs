import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class Bullet {
	constructor(scene, position) {
		this.speed = 60;
		this.alive = true;

		this.scene = scene;

		// Core bullet
		const geo = new THREE.SphereGeometry(0.15, 8, 8);
		this.mat = new THREE.MeshStandardMaterial({
			color: 0x00ffcc,
			emissive: 0x00ffcc,
			emissiveIntensity: 1.4,
			roughness: 0.3,
			metalness: 0.6,
		});

		this.mesh = new THREE.Mesh(geo, this.mat);
		this.mesh.position.copy(position);
		scene.add(this.mesh);

		this.radius = 0.2;

		// Trail
		this.trailLength = 6;
		this.trailPositions = [];
		this.trailGeo = new THREE.BufferGeometry();
		this.trailMat = new THREE.LineBasicMaterial({
			color: 0x66ffff,
			transparent: true,
			opacity: 0.7,
		});

		this.trailLine = new THREE.Line(this.trailGeo, this.trailMat);
		scene.add(this.trailLine);

		this._pulseT = 0;
	}

	update(dt) {
		if (!this.alive) return;

		// Move bullet
		this.mesh.position.z -= this.speed * dt;

		// Pulse (energy feel)
		this._pulseT += dt * 20;
		const s = 1 + Math.sin(this._pulseT) * 0.25;
		this.mesh.scale.set(s, s, s);

		// Record trail
		this.trailPositions.unshift(this.mesh.position.clone());
		if (this.trailPositions.length > this.trailLength) {
			this.trailPositions.pop();
		}

		// Update trail geometry
		const points = [];
		for (let i = 0; i < this.trailPositions.length; i++) {
			points.push(this.trailPositions[i]);
		}
		this.trailGeo.setFromPoints(points);

		// Fade trail
		this.trailMat.opacity = 0.7 * (this.trailPositions.length / this.trailLength);

		// Kill bullet
		if (this.mesh.position.z < -80) {
			this.alive = false;
		}
	}

	destroy(scene) {
		scene.remove(this.mesh);
		scene.remove(this.trailLine);

		this.trailGeo.dispose();
		this.trailMat.dispose();
		this.mat.dispose();
	}
}
