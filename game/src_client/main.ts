import * as THREE from 'three';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHand } from './CardHand.ts';
import { io } from 'socket.io-client'
import { CardHeap } from './CardHeap.ts';
import { Player } from './Player.ts';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Opponent } from './Opponent.ts';
import { Game } from './Game.ts';
import { GameStatus } from './GameStatus.ts';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/Addons.js';

const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, resolution.x / resolution.y, 0.1, 100);
export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
export const gameStatus = new GameStatus();

const effectComposer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
export const outlinePass = new OutlinePass(new THREE.Vector2(resolution.x, resolution.y), scene, camera);
const outputPass = new OutputPass();

const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);
effectComposer.setPixelRatio(pixelRatio);

effectComposer.setSize(window.innerWidth, window.innerHeight);
outlinePass.visibleEdgeColor.set("#ffffff");
outlinePass.hiddenEdgeColor.set("#ffffff");
outlinePass.edgeStrength = 5.0;
outlinePass.edgeThickness = 1.0;
outlinePass.edgeGlow = 1.0;
outlinePass.overlayMaterial.blending = THREE.NormalBlending;
outlinePass.overlayMaterial.needsUpdate = true;

effectComposer.addPass(renderPass);
effectComposer.addPass(outlinePass);
effectComposer.addPass(outputPass);

renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('threejs-canvas');
container?.appendChild(renderer.domElement);

// Setup Scene

// scene.background = new THREE.Color("#383B3D")

const tableGeometry = new THREE.CylinderGeometry(5, 4.9, 1, 64);
const tableMaterial = new THREE.MeshLambertMaterial({ color: 0xebbb52 });
const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
scene.add(tableMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 25, 20);
light.position.set(0, 4, 0);
scene.add(light);

const light1 = new THREE.PointLight(0xffffff, 25, 20);
light1.position.set(0, 5, 7);
scene.add(light1);

export const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 10, 0);
orbitControls.update();

// camera.rotation.set();

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
	effectComposer.setSize(width, height);

	const pixelRatio = Math.min(window.devicePixelRatio, 2);
	renderer.setPixelRatio(pixelRatio);
	effectComposer.setPixelRatio(pixelRatio);
}
window.addEventListener('resize', resize);

// temp for playerid, should use cookies or smth else
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('id');
const sessionId = urlParams.get('sessionId');
const authId = playerId; // get authId from authentication server

if (authId && sessionId && playerId) {
	const game = new Game(authId, sessionId, playerId);
}

function animate(time: DOMHighResTimeStamp) {
	orbitControls.update();
	// renderer.render(scene, camera);
	effectComposer.render();
	// console.log(renderer.info.render.calls);
}
renderer.setAnimationLoop(animate);
