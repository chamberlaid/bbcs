import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class Asteroid {
	constructor(scene) {
		this.speed = 10 + Math.random() * 8;
		this.alive = true;

		const radius = 0.8 + Math.random() * 2;
		this.radius = radius;

		const geo = new THREE.IcosahedronGeometry(radius, 1);
		const pos = geo.attributes.position;

		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			const z = pos.getZ(i);

			const distortion = 0.7 + Math.random() * 0.6;
			pos.setXYZ(i, x * distortion, y * distortion, z * distortion);
		}

		geo.computeVertexNormals();

		const mat = new THREE.MeshStandardMaterial({
			color: 0x777777,
			roughness: 1,
			metalness: 0,
			flatShading: true,
		});

		this.mesh = new THREE.Mesh(geo, mat);

		const x = (Math.random() - 0.5) * 20;
		const z = -60 - Math.random() * 40;
		this.mesh.position.set(x, 0, z);

		this.rotSpeed = new THREE.Vector3(
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2
		);

		scene.add(this.mesh);
	}

	update(dt) {
		if (!this.alive) return;

		this.mesh.position.z += this.speed * dt;

		this.mesh.rotation.x += this.rotSpeed.x * dt;
		this.mesh.rotation.y += this.rotSpeed.y * dt;
		this.mesh.rotation.z += this.rotSpeed.z * dt;

		if (this.mesh.position.z > 25) {
			this.alive = false;
		}
	}

	destroy(scene) {
		scene.remove(this.mesh);
	}
}
