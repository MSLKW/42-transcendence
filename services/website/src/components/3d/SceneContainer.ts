import * as THREE from 'three';
import type { ThreeJsManager } from './ThreeJsManager';

export abstract class SceneContainer {
	public scene: THREE.Scene;

	constructor() {
		this.scene = new THREE.Scene();
	}

	public abstract animate(ctx: ThreeJsManager): void;
	public abstract setupCamera(ctx: ThreeJsManager): void;

	public dispose() {
		this.scene.clear();
	}
}