import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import { CardHandTransmit, CardRank, CardSuit, GameStateTransmit, GameStartRequest, StatusTransmit, SeatOrderTransmit } from '../src_shared/Types.ts';
import { CardHeap } from './CardHeap.ts';
import { Player } from './Player.ts';
import { Opponent } from './Opponent.ts';
import { camera, orbitControls } from './main.ts';
import { gsap } from 'gsap';

export class Game {
	private socket: Socket;
	private cardHeap: CardHeap = new CardHeap(new THREE.Vector3(0, 0.6, 0));;
	private playerId: string;
	// private player: Player | undefined; // Properly clear up the player and opponents after game ends
	// private opponents: Array<Opponent>;

	// Buttons
	private startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;
	private takeSeatButton = document.getElementById('take-seat-button') as HTMLButtonElement;
	private leaveSeatButton = document.getElementById('leave-seat-button') as HTMLButtonElement;
	private takeSeatInput = document.getElementById('take-seat-input') as HTMLInputElement;


	constructor(authId: string, sessionId: string, playerId: string) {
		this.playerId = playerId;
		this.socket = io('http://localhost:3000', {
			auth: {
				token: authId,
				lobbyId: sessionId
			}
		})

		// this.player = undefined;
		// this.opponents = [];


		this.bindSocketEvents();
		this.bindButtonEvents();
	}

	private bindButtonEvents() {
		this.startGameButton.addEventListener('click', () => {
			const gameStartRequest: GameStartRequest = {
				playerId: this.playerId
			}
			this.socket.emit("game_start_request", gameStartRequest);
		});

		this.takeSeatButton.addEventListener('click', () => {
			this.socket.emit("user_seat_take", Number(this.takeSeatInput.value));
		});

		this.leaveSeatButton.addEventListener('click', () => {
			this.socket.emit("user_seat_leave");
		});
	}

	private bindSocketEvents() {
		this.socket.on("connect", () => {
			console.log(`Socket connected`);
		});
		this.socket.on("graceful_disconnect", () => {
			this.socket.disconnect();
		});
		this.socket.on("disconnect", () => {
			console.log('Socket disconnected')
		});

		this.socket.on("game_start_request", (status: StatusTransmit) => {
			if (status.success === true) {
				this.startGameButton.disabled = true;
			}
			console.log(`Start Game: ${status.success} | ${status.message}`);
		});
	
		this.socket.on("game_end", () => {
			this.startGameButton.disabled = false;
			this.cardHeap.reset();
		});
	
		this.socket.on("player_connection_update", (connections: Record<string, boolean>) => {
			console.log(connections);
		});
	
		this.socket.on("user_seat_take", (status: StatusTransmit) => {
			console.log(`Take seat: ${status.success} | ${status.message}`);
		});
	
		this.socket.on("user_seat_leave", (status: StatusTransmit) => {
			console.log(`Left Seat: ${status.success} | ${status.message}`);
		});
	
		this.socket.on("user_seat_update", (seatOrder: SeatOrderTransmit) => {
			console.log(seatOrder);
		});
	
		this.socket.on("user_list_update", (list: Array<string>) => {
			console.log(list);
		})
	
		this.socket.on("game_state", (gameState: GameStateTransmit) => {
			this.startGameButton.disabled = true;
	
			this.cardHeap.sync(gameState.cardHeap);
			const seatOrder = gameState.playerSeatOrder;
			const playerSeatIndex = gameState.playerSeatOrder[this.playerId];
			const totalSeats = Object.keys(seatOrder).length;
	
			const relativeSeatOrder = Object.entries(seatOrder).sort(([, indexA], [, indexB]) => {
				const distanceA = (indexA - playerSeatIndex + totalSeats) % totalSeats;
				const distanceB = (indexB - playerSeatIndex + totalSeats) % totalSeats;
				return distanceA - distanceB;
			}).map(([id]) => id);
			
			for (let i = 0; i < relativeSeatOrder.length; i++) {
				const id = relativeSeatOrder[i];
				if (id === this.playerId) {
					const player = new Player(this.socket, this.playerId, this.cardHeap); // 2nd game bug where player is doubled, rly need to make a clean game state for client
					const [pos, rot] = this.tablePosition(i, true);
					player.cardManager.updateManager(pos, rot);
					const dummy = new THREE.Object3D();
					dummy.position.copy(camera.position);
					dummy.lookAt(new THREE.Vector3());
					this.move(camera, new THREE.Vector3(pos.x * 1.5, pos.y * 3, pos.z * 1.5), dummy.quaternion);
					orbitControls.update();
					player.setupGameState(gameState);
					
				}
				else if (id !== this.playerId) {
					const opponent = new Opponent(this.socket, id, this.cardHeap);
					const [pos, rot] = this.tablePosition(i, false);
					opponent.cardManager.updateManager(pos, rot);
					opponent.setupGameState(gameState);
				}
			}
		});
	}

	public move(object: THREE.Object3D, position: THREE.Vector3, rotation: THREE.Quaternion) {
		gsap.to(object.position, {
			x: position.x,
			y: position.y,
			z: position.z,
			duration: 1,
		});
		gsap.to({ progress: 0 }, {
			progress: 1,
			duration: 1,
			onUpdate: function () {
				object.quaternion.slerp(rotation, this.progress());
			}
		});
	}

	private tablePosition(seatIndex: number, isPlayer: boolean): [THREE.Vector3, THREE.Quaternion] {
		const positions: Array<THREE.Vector3> = [
			new THREE.Vector3(0, 2, 4),
			new THREE.Vector3(-4, 2, 0),
			new THREE.Vector3(0, 2, -4),
			new THREE.Vector3(4, 2, 0),
		];
		const rotations: Array<THREE.Euler> = [
			new THREE.Euler(-Math.PI / 8, 0, 0),
			new THREE.Euler(0, -Math.PI / 2, 0),
			new THREE.Euler(0, -Math.PI, 0),
			new THREE.Euler(0, Math.PI / 2, 0),
		]
		return ([positions[seatIndex], new THREE.Quaternion().setFromEuler(rotations[seatIndex])]);
	}
}