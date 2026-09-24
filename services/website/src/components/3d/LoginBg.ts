import * as THREE from 'three';
import { SphereBg } from './Sphere';
import { SceneContainer } from './SceneContainer';
import type { ThreeJsManager } from './ThreeJsManager';
import { Card } from './PCard';

export class LoginScene extends SceneContainer {
	private ambientLight: THREE.AmbientLight;
	private directionalLight: THREE.DirectionalLight;
	private sphere: THREE.Mesh;
	private card: THREE.Mesh;
	private timer: THREE.Timer;

	constructor() {
		super();

		this.timer = new THREE.Timer();
		this.timer.connect(document);
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		this.directionalLight.position.set(0, 5, 5);
		this.sphere = SphereBg();
		this.card = Card(new THREE.Vector3(0, 0.25, 0), new THREE.Euler(-Math.PI / 4, 0, 0), "gold");
		this.scene.add(this.ambientLight, this.directionalLight, this.sphere, this.card);
	}

	public setupCamera(ctx: ThreeJsManager): void {
		ctx.camera.fov = 50;
		ctx.camera.near = 0.1;
		ctx.camera.far = 100;
		ctx.camera.position.set(0, 0, 2.25);
		ctx.orbitControls.enableZoom = false;
		ctx.orbitControls.enableDamping = true;
		ctx.orbitControls.dampingFactor = 0.05;
		ctx.camera.updateProjectionMatrix();
	}

	public animate(ctx: ThreeJsManager): void {
		const delta = this.timer.getDelta();
		this.timer.update();
		this.sphere.rotation.y += 0.025 * delta;
		this.sphere.rotation.x += 0.0125 * delta;
		// this.scene.traverse((object) => {console.log(object)});
		ctx.orbitControls.update();
		ctx.renderer.render(this.scene, ctx.camera);
	}

	public dispose(): void {
		this.scene.clear();
		this.ambientLight.dispose();
		this.directionalLight.dispose();
		this.sphere.geometry.dispose();
		// this.sphere.material.
	}
}