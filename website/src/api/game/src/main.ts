import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Game } from './Game.ts';
import { GameStatus } from './GameStatus.ts';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { gsap } from 'gsap';
import { Socket } from 'socket.io-client';
import { useSceneStore } from '../../../store/SceneStore.ts';
import { useGameStore } from "../../../store/GameStore.ts";
import { SceneContainer } from '../../../components/3d/SceneContainer.ts';
import { GameScene } from './GameScene.ts';

// export const scene = new THREE.Scene();
// export let camera: THREE.PerspectiveCamera;
// export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
export const gameStatus = new GameStatus();

// export let outlinePass: OutlinePass;

// export let cameraLight: THREE.PointLight;
// export let orbitControls: OrbitControls;

export let gameInstance: Game | null = null;
// export let gameScene: GameScene;

let cleanupGame: (() => void) | null = null;

/*
	Will Initialize in the a container specified by containerId
*/
// export function initGameClient(container: HTMLElement) {
// 	const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
// 	camera = new THREE.PerspectiveCamera(75, resolution.x / resolution.y, 0.1, 100);
// 	const effectComposer = new EffectComposer(renderer);
// 	const renderPass = new RenderPass(scene, camera);
// 	outlinePass = new OutlinePass(new THREE.Vector2(resolution.x, resolution.y), scene, camera);
// 	const outputPass = new OutputPass();

// 	// const cameraAudioListener = new THREE.AudioListener();
// 	// camera.add(cameraAudioListener);
	
// 	const pixelRatio = Math.min(window.devicePixelRatio, 2);
// 	renderer.setPixelRatio(pixelRatio);
// 	effectComposer.setPixelRatio(pixelRatio);
	
// 	effectComposer.setSize(resolution.x, resolution.y);
// 	outlinePass.visibleEdgeColor.set("#ffffff");
// 	outlinePass.hiddenEdgeColor.set("#ffffff");
// 	outlinePass.edgeStrength = 5.0;
// 	outlinePass.edgeThickness = 1.0;
// 	outlinePass.edgeGlow = 1.0;
// 	outlinePass.overlayMaterial.blending = THREE.NormalBlending;
// 	outlinePass.overlayMaterial.needsUpdate = true;
	
// 	effectComposer.addPass(renderPass);
// 	effectComposer.addPass(outlinePass);
// 	effectComposer.addPass(outputPass);
	
// 	renderer.setSize(resolution.x, resolution.y);
// 	container?.appendChild(renderer.domElement);
		
// 	// scene.background = new THREE.Color("#383B3D")
	
// 	const tableGeometry = new THREE.CylinderGeometry(5, 4.9, 1, 64);
// 	const tableMaterial = new THREE.MeshLambertMaterial({ color: 0xebbb52 });
// 	const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
// 	scene.add(tableMesh);
	
// 	const ambientLight = new THREE.AmbientLight(0xffffff, 0.06);
// 	scene.add(ambientLight);
	
// 	const lightSettings = {
// 		intensity: 7,
// 		distance: 8,
// 		angle: 0.73,
// 		penumbra: 0.14,
// 		decay: 0.2,
// 	}
	
// 	const light = new THREE.SpotLight(0xffffff, 
// 		lightSettings.intensity, 
// 		lightSettings.distance, 
// 		lightSettings.angle, 
// 		lightSettings.penumbra, 
// 		lightSettings.decay
// 	);
// 	light.position.set(0, 7, 0);
// 	light.target.position.set(0, 0, 0);
// 	scene.add(light);
	
// 	// const lightHelper = new THREE.SpotLightHelper(light);
// 	// scene.add(lightHelper);
	
// 	cameraLight = new THREE.PointLight(0xffffff, 20, 20);
// 	cameraLight.position.set(0, 5, 7);
// 	scene.add(cameraLight);
	
// 	orbitControls = new OrbitControls(camera, renderer.domElement);
// 	camera.position.set(0, 10, 0);
// 	orbitControls.update();
	
// 	// camera.rotation.set();
	
// 	// const gui = new GUI();
// 	// const cameraFolder = gui.addFolder('Camera Position');
// 	// const lensFolder = gui.addFolder('Camera Lens');
	
// 	// cameraFolder.add(camera.position, 'x', 0, 10, 0.1).name('X').listen();
// 	// cameraFolder.add(camera.position, 'y', 0, 10, 0.1).name('Y').listen();
// 	// cameraFolder.add(camera.position, 'z', 0, 10, 0.1).name('Z').listen();
	
// 	// lensFolder.add(camera, 'fov', 20, 100, 1).name("FOV").onChange(() => {
// 	// 	camera.updateProjectionMatrix();
// 	// })
	
// 	// const spotlightFolder = gui.addFolder('Spotlight');
	
// 	// spotlightFolder.add(light.position, 'y', 0, 100, 1).name('Height');
// 	// spotlightFolder.add(light, 'intensity', 0, 100, 1).name('Intensity');
// 	// spotlightFolder.add(light, 'distance', 0, 100, 1).name('Distance');
// 	// spotlightFolder.add(light, 'angle', 0, Math.PI / 2, 0.01).name('Angle');
// 	// spotlightFolder.add(light, 'penumbra', 0, 2, 0.01).name('Penumbra');
// 	// spotlightFolder.add(light, 'decay', 0, 5, 0.1).name('Decay');
// 	// // spotlightFolder.onChange(() => {
// 	// 	lightHelper.update();
// 	// })
	
// 	// const ambientLightFolder = gui.addFolder('AmbientLight');
// 	// ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.01).name('Intensity');
	
// 	function animate(time: DOMHighResTimeStamp) {
// 		orbitControls.update();
// 		// renderer.render(scene, camera);
// 		effectComposer.render();
// 		// console.log(renderer.info.render.calls);
// 	}
// 	renderer.setAnimationLoop(animate);

// 	// cleanupGame = () => {
// 	// 	window.removeEventListener('resize', resize);
// 	// 	renderer.setAnimationLoop(null);
// 	// 	// socket.disconnect()
// 	// 	orbitControls.dispose();
// 	// 	renderer.dispose();

// 	// 	gui.destroy();

// 	// 	scene.remove(tableMesh);
// 	// 	tableGeometry.dispose();
// 	// 	tableMaterial.dispose();

// 	// 	scene.remove(ambientLight);
// 	// 	scene.remove(light);
// 	// 	if (cameraLight) {
// 	// 		scene.remove(cameraLight);
// 	// 	}

// 	// 	effectComposer.dispose();
// 	// 	renderPass.dispose();
// 	// 	outlinePass.dispose();
// 	// 	outputPass.dispose();

// 	// 	if (container && renderer.domElement) {
// 	// 		container.removeChild(renderer.domElement);
// 	// 	}
// 	// 	renderer.dispose();
// 	// }
// 	// return (cleanupGame);
// }

export function joinGameLobby(gameSessionId: string, playerId: string) {
	if (gameInstance !== null) {
		console.log("[Game] Game Session is already ongoing");	
	}
	gameInstance = new Game(gameSessionId, playerId);
	

	useSceneStore.getState().setCurrentScene("Lobby");
}

// const urlParams = new URLSearchParams(window.location.search);
// const playerId = urlParams.get('id');
// const sessionId = urlParams.get('sessionId');

// const container = document.getElementById("threejs-canvas");
// if (container) {
// 	initGameClient(container);
// 	if (sessionId && playerId) {
// 		joinGameLobby(sessionId, playerId);
// 	}
// }