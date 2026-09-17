import * as THREE from 'three';
import { SceneContainer } from '../../../components/3d/SceneContainer.ts';
import { ThreeJsManager } from '../../../components/3d/ThreeJsManager.ts';

export class GameScene extends SceneContainer {
	public tableGeometry: THREE.CylinderGeometry;
	public tableMaterial: THREE.MeshLambertMaterial;
	public tableMesh: THREE.Mesh;
	public ambientLight: THREE.AmbientLight;
	public light: THREE.SpotLight;
	public cameraLight: THREE.PointLight;

	constructor() {
		super();
		this.tableGeometry = new THREE.CylinderGeometry(5, 4.9, 1, 64);
		this.tableMaterial = new THREE.MeshLambertMaterial({ color: 0xebbb52 });
		this.tableMesh = new THREE.Mesh(this.tableGeometry, this.tableMaterial);
		this.scene.add(this.tableMesh);
		
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.06);
		this.scene.add(this.ambientLight);

		const lightSettings = {
			intensity: 7,
			distance: 8,
			angle: 0.73,
			penumbra: 0.14,
			decay: 0.2,
		}

		this.light = new THREE.SpotLight(0xffffff, 
			lightSettings.intensity, 
			lightSettings.distance, 
			lightSettings.angle, 
			lightSettings.penumbra, 
			lightSettings.decay
		);
		this.light.position.set(0, 7, 0);
		this.light.target.position.set(0, 0, 0);
		this.scene.add(this.light);
		
		// const lightHelper = new THREE.SpotLightHelper(light);
		// this.scene.add(lightHelper);
		
		this.cameraLight = new THREE.PointLight(0xffffff, 20, 20);
		this.cameraLight.position.set(0, 5, 7);
		this.scene.add(this.cameraLight);
	}

	public animate(ctx: ThreeJsManager): void {
		ctx.orbitControls.update();
		ctx.effectComposer.render();
	}

	public setupCamera(ctx: ThreeJsManager): void {
		ctx.camera.fov = 75;
		ctx.camera.near = 0.1;
		ctx.camera.far = 100;
		ctx.camera.position.set(0, 10, 0);
		ctx.orbitControls.enableDamping = false;
		ctx.orbitControls.enableZoom = true;
		ctx.camera.updateProjectionMatrix();
		ctx.orbitControls.update();
	}

	public dispose() {
		this.scene.clear();
		this.tableGeometry.dispose();
		this.tableMaterial.dispose();
	}
}