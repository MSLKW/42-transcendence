import * as THREE from 'three';
import { CardHandTransmit, CardRank, CardSuit, CardTransmit, HandType, PentupleType, PlayerSeatOrderTransmit } from '../src_shared/Types.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHand } from './CardHand.ts';
import { io } from 'socket.io-client'
import { CardHeap } from './CardHeap.ts';
import { Player } from './Player.ts';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Opponent } from './Opponent.ts';
import { GameStatus } from './GameStatus.ts';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/Addons.js';
import { effect } from 'zod/v3';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
export const renderer = new THREE.WebGLRenderer();
export let outlinePass: OutlinePass;
export let gameStatus: GameStatus;

let cleanupGame: (() => void) | null = null;

export function initGame(containerId: string) {
	if (cleanupGame)
		cleanupGame();

	gameStatus = new GameStatus();
	
	const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)

	// 2. Setup the existing global instances
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();

	const effectComposer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera);
	outlinePass = new OutlinePass(new THREE.Vector2(resolution.x, resolution.y), scene, camera);
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

	const container = document.getElementById(containerId);
	container?.appendChild(renderer.domElement);

	// Setup Scene

	scene.background = new THREE.Color("#383B3D")

	const tableGeometry = new THREE.CylinderGeometry(10, 10, 1, 32);
	const tableMaterial = new THREE.MeshBasicMaterial({ color: 0xebbb52 });
	const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
	scene.add(tableMesh);

	const floorGeometry = new THREE.PlaneGeometry(50, 50);
	const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x122654 });
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
	floorMesh.position.set(0, -3, 0);
	floorMesh.rotation.x = -Math.PI / 2;
	scene.add(floorMesh)

	const boxGeometry = new THREE.BoxGeometry(5, 10, 5);
	const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x2bcfb3 });
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.set(20, 2, 20);

	const box2Material = new THREE.MeshBasicMaterial({ color: 0x88cf2b });
	const box2Mesh = new THREE.Mesh(boxGeometry, box2Material);
	box2Mesh.position.set(-20, 2, -20);
	scene.add(boxMesh, box2Mesh);

	const orbitControls = new OrbitControls(camera, renderer.domElement);
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
		socket.on('disconnect', () => {
			console.log('Socket disconnected')
		});

		socket.on('player_join', (playerJoin: PlayerSeatOrderTransmit) => { 
			console.log(playerJoin);
			if (playerJoin.playerId === playerId) {
				const player = new Player(socket, playerId, cardHeap);
				const [pos, rot] = tablePosition(playerJoin.seatOrder[playerId], true);
				player.cardManager.updateManager(pos, rot);
				const seatOrder: Record<string, number> = playerJoin.seatOrder;
				Object.keys(seatOrder).forEach((id) => {
					if (id !== playerId ) {
						const opponent = new Opponent(socket, id, cardHeap);
						const [pos, rot] = tablePosition(playerJoin.seatOrder[id], false);
						opponent.cardManager.updateManager(pos, rot);
					}
				})
			}
			else {
				const opponent = new Opponent(socket, playerJoin.playerId, cardHeap);
				const [pos, rot] = tablePosition(playerJoin.seatOrder[playerJoin.playerId], false);
				opponent.cardManager.updateManager(pos, rot);
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

	let socket: any;

	function animate(time: DOMHighResTimeStamp) {
		orbitControls.update();
		// renderer.render(scene, camera);
		effectComposer.render();
		// console.log(renderer.info.render.calls);
	}
	renderer.setAnimationLoop(animate);

	cleanupGame = () => {
		window.removeEventListener('resize', resize);
		renderer.setAnimationLoop(null);
		socket?.disconnect();
		orbitControls.dispose();
		renderer.dispose();

		scene.remove(tableMesh);
		tableGeometry.dispose();
		tableMaterial.dispose();

		if (container && renderer.domElement && container.contains(renderer.domElement))
			container.removeChild(renderer.domElement);
    };

    return cleanupGame;
}
