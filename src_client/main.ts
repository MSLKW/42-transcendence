import * as THREE from 'three';
import { CardHandTransmit, CardRank, CardSuite, CardTransmit, HandType, PentupleType } from '../src_shared/Types.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHand } from './CardHand.ts';
import { CardHeap } from './CardHeap.ts';
import { Player } from './Player.ts';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
export const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const tableGeometry = new THREE.CylinderGeometry(10, 10, 1, 20);
// const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x4c5ee6 });
// const cylinderMesh = new THREE.Mesh(tableGeometry, tableMaterial);
// scene.add(cylinderMesh);
const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 10);
orbitControls.update();

// camera.rotation.set();

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
}
window.addEventListener('resize', resize);

// temp for playerid, should use cookies or smth else
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('id');

const cardHeap = new CardHeap();
if (playerId) {
	const player = new Player(playerId, cardHeap);
}

function animate(time: DOMHighResTimeStamp) {
	orbitControls.update();
	renderer.render(scene, camera);
	// console.log(renderer.info.render.calls);
}
renderer.setAnimationLoop(animate);
