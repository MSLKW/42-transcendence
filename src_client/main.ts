import * as THREE from 'three';
import { CardHandTransmit, CardRank, CardSuite, CardTransmit, HandType, PentupleType } from '../src_shared/Types.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHand } from './CardHand.ts';
import { CardHeap } from './CardHeap.ts';
import { Player } from './Player.ts';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
export const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 10);

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
	renderer.render(scene, camera);
	// console.log(renderer.info.render.calls);
}
renderer.setAnimationLoop(animate);
