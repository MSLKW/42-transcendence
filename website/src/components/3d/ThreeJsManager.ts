import * as THREE from 'three';
import { EffectComposer, OutlinePass, RenderPass, OutputPass, OrbitControls } from 'three/examples/jsm/Addons.js';
import { GameScene } from '../../api/game/src/GameScene.ts';
import { SceneContainer } from './SceneContainer.ts';
import { LoginScene } from './LoginBg.ts';
import { gsap } from 'gsap';

/*
	Handles Scene Management and Animation etc...
*/

export class ThreeJsManager {
	public	renderer: THREE.WebGLRenderer;
	public	pixelRatio: number;
	public	camera: THREE.PerspectiveCamera;
	public	orbitControls: OrbitControls;
	public	resolution: THREE.Vector2;
	public	effectComposer: EffectComposer;
	public	renderPass: RenderPass;
	public	outlinePass: OutlinePass
	public	outputPass: OutputPass;
	public	visibility: boolean;
	private currentSceneId: string;
	private scenes: Record<string, SceneContainer>;
	private container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
		this.scenes = {};
		this.currentSceneId = "";
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.visibility = true;

		this.resolution = new THREE.Vector2(this.container.clientWidth, this.container.clientHeight); // temp window var
		console.log(this.resolution);
		this.camera = new THREE.PerspectiveCamera(75, this.resolution.x / this.resolution.y, 0.1, 100);
		this.pixelRatio = Math.min(window.devicePixelRatio, 2);
		this.renderer.setPixelRatio(this.pixelRatio);
		this.renderer.setSize(this.resolution.x, this.resolution.y);
		// this.renderer.setViewport(0, 0, this.resolution.x, this.resolution.y);

		// Adding Login Scene and relevant items

		const loginScene = new LoginScene();
		loginScene.scene.add(this.camera);
		this.addScene("login", loginScene);
		
		// Adding Game Scene and relevant items
		const gameScene = new GameScene();

		this.effectComposer = new EffectComposer(this.renderer);
		this.renderPass = new RenderPass(gameScene.scene, this.camera);
		this.outlinePass = new OutlinePass(this.resolution, gameScene.scene, this.camera);
		this.outputPass = new OutputPass();

		this.effectComposer.setPixelRatio(this.pixelRatio);
		this.effectComposer.setSize(this.resolution.x, this.resolution.y);

		// // 1. Create a 4D Vector to store the result (X, Y, Width, Height)
		// const viewportRect = new THREE.Vector4();

		// // 2. Query the renderer
		// this.renderer.getCurrentViewport(viewportRect);

		// // 3. Read the bounds
		// console.log("Viewport X offset:", viewportRect.x);
		// console.log("Viewport Y offset:", viewportRect.y);
		// console.log("Viewport Width:",    viewportRect.z); // .z maps to width
		// console.log("Viewport Height:",   viewportRect.w); // .w maps to height
		
		this.outlinePass.visibleEdgeColor.set("#ffffff");
		this.outlinePass.hiddenEdgeColor.set("#ffffff");
		this.outlinePass.edgeStrength = 5.0;
		this.outlinePass.edgeThickness = 1.0;
		this.outlinePass.edgeGlow = 1.0;
		this.outlinePass.overlayMaterial.blending = THREE.NormalBlending;
		this.outlinePass.overlayMaterial.needsUpdate = true;
		
		this.effectComposer.addPass(this.renderPass);
		this.effectComposer.addPass(this.outlinePass);
		this.effectComposer.addPass(this.outputPass);
		gameScene.scene.add(this.camera);
		this.addScene("game", gameScene);

		this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

		this.bindEvents();
		gsap.ticker.lagSmoothing(false);

		this.renderer.setAnimationLoop(() => {
			this.animate()
		});
		container.appendChild(this.renderer.domElement);
		this.camera.updateProjectionMatrix();
	}

	public addScene(id: string, scene: SceneContainer): void {
		if (id.length === 0)
			return ;
		this.scenes[id] = scene;
	}

	private bindEvents() {
		window.addEventListener('resize', this.handleResize);
	}

	public animate() {
		if (this.visibility === false)
			return ;
		const sceneContainer = this.scenes[this.currentSceneId];
		if (sceneContainer === undefined) {
			return ;
		}
		sceneContainer.animate(this);
	}

	public changeScene(sceneId: string) {
		this.currentSceneId = sceneId;
		const sceneContainer = this.scenes[this.currentSceneId];
		console.log("changing scene to " + this.currentSceneId);
		if (sceneContainer === undefined) {
			this.toggleVisibility(false);
			return ;
		}
		this.toggleVisibility(true);
		sceneContainer.setupCamera(this);
	}
	
	public toggleVisibility(visibility: boolean) {
		this.visibility = visibility;
		if (this.visibility === true) {
			this.renderer.domElement.style.visibility = 'visible';
			this.renderer.setAnimationLoop(() => {
				this.animate();
			});
		}
		else {
			this.renderer.domElement.style.visibility = 'hidden';
			this.renderer.setAnimationLoop(null);
		}
	}

	public dispose() {
		window.removeEventListener('resize', this.handleResize);
		this.orbitControls.dispose();

		this.renderer.setAnimationLoop(null);
		for (const scene of Object.values(this.scenes)) {
			scene.dispose();
		}
		
		this.effectComposer.dispose();
		this.renderPass.dispose();
		this.outlinePass.dispose();
		this.outputPass.dispose();
		this.renderer.dispose();
		this.container.removeChild(this.renderer.domElement);
	}

	private handleResize = (event: UIEvent): void => {
		const rect = this.container.getBoundingClientRect();
		this.resolution.x = rect.width;
		this.resolution.y = rect.height;
	
		this.camera.aspect = this.resolution.x / this.resolution.y;
		this.camera.updateProjectionMatrix();
	
		this.renderer.setSize(this.resolution.x, this.resolution.y);
		this.effectComposer.setSize(this.resolution.x, this.resolution.y);
		this.outlinePass.resolution.set(this.resolution.x, this.resolution.y);
	
		const pixelRatio = Math.min(window.devicePixelRatio, 2);
		this.renderer.setPixelRatio(pixelRatio);
		this.effectComposer.setPixelRatio(pixelRatio);
	}
}