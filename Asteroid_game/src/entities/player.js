import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class Player {
	constructor(scene) {
		this.speed = 20;
		this.cooldown = 0;
		this.cooldownTime = 0.25;
		this.alive = true;

		this.life = 3;
		this.invuln = 0;
		this._pulseT = 0;

		this.mesh = new THREE.Group();

		// === main fuselage (flat, wide) ===
		const bodyGeo = new THREE.BoxGeometry(1.2, 0.3, 2.2);
		this.bodyMat = new THREE.MeshStandardMaterial({
			color: 0x00ffcc,
			emissive: 0x003333,
			metalness: 0.4,
			roughness: 0.45,
		});
		const body = new THREE.Mesh(bodyGeo, this.bodyMat);
		this.mesh.add(body);

		// === cockpit canopy ===
		const canopyGeo = new THREE.SphereGeometry(0.35, 16, 12);
		const canopyMat = new THREE.MeshStandardMaterial({
			color: 0x66ffff,
			emissive: 0x004444,
			metalness: 0.1,
			roughness: 0.2,
			transparent: true,
			opacity: 0.85,
		});
		const canopy = new THREE.Mesh(canopyGeo, canopyMat);
		canopy.scale.set(1, 0.6, 1);
		canopy.position.set(0, 0.25, 0.2);
		this.mesh.add(canopy);

		// === wings (wide, thin) ===
		const wingGeo = new THREE.BoxGeometry(3.2, 0.12, 1.2);
		const wingMat = new THREE.MeshStandardMaterial({
			color: 0x006666,
			metalness: 0.3,
			roughness: 0.6,
		});
		const wings = new THREE.Mesh(wingGeo, wingMat);
		wings.position.y = -0.05;
		this.mesh.add(wings);

		// === nose wedge ===
		const noseGeo = new THREE.ConeGeometry(0.6, 0.8, 4);
		const noseMat = new THREE.MeshStandardMaterial({
			color: 0x00cccc,
			metalness: 0.4,
			roughness: 0.4,
		});
		const nose = new THREE.Mesh(noseGeo, noseMat);
		nose.rotation.x = Math.PI / 2;
		nose.position.z = 1.5;
		this.mesh.add(nose);

		// === twin engines ===
		const engineGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.6, 12);
		this.engineMat = new THREE.MeshStandardMaterial({
			color: 0x00ffff,
			emissive: 0x00ffff,
			emissiveIntensity: 1.3,
			metalness: 0.2,
			roughness: 0.4,
		});

		const engineLeft = new THREE.Mesh(engineGeo, this.engineMat);
		engineLeft.rotation.x = Math.PI / 2;
		engineLeft.position.set(-0.45, -0.05, -1.4);

		const engineRight = engineLeft.clone();
		engineRight.position.x = 0.45;

		this.mesh.add(engineLeft);
		this.mesh.add(engineRight);

		this.engines = [engineLeft, engineRight];

  this.mesh.position.set(0, 0, 8);
  this.mesh.rotation.y = Math.PI; // <--- flip 180°
  scene.add(this.mesh);

	}

	update(dt, input) {
		if (!this.alive) return;

		if (this.cooldown > 0) this.cooldown -= dt;
		if (this.invuln > 0) this.invuln -= dt;

		const moveX = (Number(input.right) - Number(input.left)) * this.speed * dt;
		const moveZ = (Number(input.down) - Number(input.up)) * this.speed * dt;

		this.mesh.position.x += moveX;
		this.mesh.position.z += moveZ;

		this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -10, 10);
		this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, 4, 12);

		// banking (feels like a real ship)
    const targetRoll = THREE.MathUtils.clamp(-moveX * 1.2, -0.5, 0.5);
		this.mesh.rotation.z += (targetRoll - this.mesh.rotation.z) * 0.15;

		// engine pulse
		this._pulseT += dt * 10;
		const pulse = 1 + Math.sin(this._pulseT) * 0.25;
		for (const e of this.engines) {
			e.scale.set(pulse, pulse, pulse);
		}
		this.engineMat.emissiveIntensity = 1.1 + Math.sin(this._pulseT) * 0.4;

		// invulnerability blink
		if (this.invuln > 0) {
			this.mesh.visible = Math.sin(this._pulseT * 2) > 0;
		} else {
			this.mesh.visible = true;
		}
	}

	canShoot() {
		return this.alive && this.cooldown <= 0;
	}

	shoot() {
		this.cooldown = this.cooldownTime;
	}

	getPosition() {
		return this.mesh.position.clone();
	}

	takeDamage(amount, scene) {
		if (!this.alive) return;
		if (this.invuln > 0) return;

		this.invuln = 0.6;
		this.life = Math.max(0, this.life - amount);

		this.bodyMat.emissive.setHex(0x00ffff);
		setTimeout(() => {
			if (this.bodyMat) this.bodyMat.emissive.setHex(0x003333);
		}, 120);

		if (this.life === 0) {
			this.destroy(scene);
		}
	}

	destroy(scene) {
		if (!this.alive) return;
		this.alive = false;
		scene.remove(this.mesh);
	}
}
