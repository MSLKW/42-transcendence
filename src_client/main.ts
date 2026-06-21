import * as THREE from 'three';
import { CardHandTransmit, CardRank, CardSuite, CardTransmit, HandType, PentupleType } from '../src_shared/Types.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHand } from './CardHand.ts';
import { io } from 'socket.io-client'
import { CardHeap } from './CardHeap.ts';
import { Player } from './Player.ts';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Opponent } from './Opponent.ts'

const container = document.getElementById('threejs-canvas');
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
export const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container?.appendChild(renderer.domElement);

const tableGeometry = new THREE.CylinderGeometry(10, 10, 1, 20);
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x4c5ee6 });
const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
scene.add(tableMesh);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.set(0, 2, 5);
scene.add(boxMesh);

const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 0);
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
const authId = playerId; // get authId from authentication server

const cardHeap = new CardHeap(new THREE.Vector3(0, 0.6, 0));
if (authId && playerId) {
	const socket = io('http://localhost:3000', {
		auth: {
			token: authId
		}
	})

	socket.on('connect', () => {
		console.log(`Socket connected`);
	});
	socket.on('graceful_disconnect', () => {
		socket.disconnect();
	});
	socket.on('disconnect', (reason) => {
		console.log('Socket disconnected')
	});

	socket.on('player_join', (playerData) => { 
		const object = JSON.parse(playerData);
		console.log(object);
		if (object.playerId === playerId) {
			const player = new Player(socket, playerId, cardHeap);
			const [pos, rot] = tablePosition(object.seatOrder[playerId], true);
			player.cardManager.update(pos, rot);
			const seatOrder: Record<string, number> = object.seatOrder;
			Object.keys(seatOrder).forEach((id) => {
				if (id !== playerId ) {
					const opponent = new Opponent(socket, id, cardHeap);
					const [pos, rot] = tablePosition(object.seatOrder[id], false);
					opponent.cardManager.update(pos, rot);
				}
			})
		}
		else {
			const opponent = new Opponent(socket, object.playerId, cardHeap);
			const [pos, rot] = tablePosition(object.seatOrder[object.playerId], false);
			opponent.cardManager.update(pos, rot);
		}
	});
}

function tablePosition(seatIndex: number, isPlayer: boolean): [THREE.Vector3, THREE.Euler] {
	const positions: Array<THREE.Vector3> = [
		new THREE.Vector3(0, 2, 8),
		new THREE.Vector3(-8, 2, 0),
		new THREE.Vector3(0, 2, -8),
		new THREE.Vector3(8, 2, 0),
	];
	const rotations: Array<THREE.Euler> = [
		new THREE.Euler(0, 0, 0),
		new THREE.Euler(0, -Math.PI / 2, 0),
		new THREE.Euler(0, -Math.PI, 0),
		new THREE.Euler(0, Math.PI / 2, 0),
	]
	if (isPlayer) {
		const pos = positions[seatIndex];
		camera.position.copy(pos);
		camera.position.x *= 1.5;
		camera.position.z *= 1.5;
		camera.position.y *= 3;
		camera.lookAt(tableMesh.position);
		orbitControls.update();
	}
	return ([positions[seatIndex], rotations[seatIndex]])
}

function animate(time: DOMHighResTimeStamp) {
	orbitControls.update();
	renderer.render(scene, camera);
	// console.log(renderer.info.render.calls);
}
renderer.setAnimationLoop(animate);
