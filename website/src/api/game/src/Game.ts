import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import { CardHandTransmit, CardRank, CardSuit, GameStateTransmit, GameStartRequest, StatusTransmit, SeatOrderTransmit, GameSettingsTransmit } from '@big2/game-types';
import { CardHeap } from './CardHeap.ts';
import { Player } from './Player.ts';
import { Opponent } from './Opponent.ts';
import { camera, cameraLight, gameStatus, orbitControls } from './main.ts';
import { Deck } from './Deck.ts';
import { gsap } from 'gsap';
import { Participant } from './Participant.ts';
import { useGameStore } from '../../../store/GameStore.tsx';

export class Game {
	private socket: Socket;
	private centerPosition: THREE.Vector3 = new THREE.Vector3(0, 0.6, 0);
	private cardHeap: CardHeap = new CardHeap(this.centerPosition);
	private playerId: string;
	private participants: Array<Participant>;

	// Buttons
	private startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;
	private takeSeatButton = document.getElementById('take-seat-button') as HTMLButtonElement;
	private leaveSeatButton = document.getElementById('leave-seat-button') as HTMLButtonElement;
	private takeSeatInput = document.getElementById('take-seat-input') as HTMLInputElement;
	private seatChangeButton = document.getElementById('seat-change-button') as HTMLButtonElement;


	constructor(sessionId: string, playerId: string) {
		this.playerId = playerId;
		this.socket = io('http://localhost:80', {
			path: "/socket/game/",
			auth: {
				lobbyId: sessionId,
				uuid: playerId
			}
			
		})

		this.participants = [];

		this.bindSocketEvents();
		this.bindButtonEvents();
	}

	public startGame() {
		const gameStartRequest: GameStartRequest = {
			playerId: this.playerId
		}
		this.socket.emit("game_start_request", gameStartRequest);
	}

	private bindButtonEvents() {
		this.startGameButton.addEventListener('click', () => {
			this.startGame();
		});

		this.takeSeatButton.addEventListener('click', () => {
			this.socket.emit("user_seat_take", Number(this.takeSeatInput.value));
		});

		this.leaveSeatButton.addEventListener('click', () => {
			this.socket.emit("user_seat_leave");
		});

		this.seatChangeButton.addEventListener('click', () => {
			this.socket.emit("user_seat_change", Number(this.takeSeatInput.value));
		})
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

		this.socket.on("user_seat_change", (status: StatusTransmit) => {
			console.log(status);
		});
	
		this.socket.on("user_list_update", (list: Array<string>) => {
			console.log(list);
		})

		this.socket.on("game_settings_update", (gameSettings: GameSettingsTransmit) => {
			console.log(gameSettings);
		});
	
		this.socket.on("game_state", (gameState: GameStateTransmit) => {
			this.initGame(gameState);
		});
	}

	private initGame(gameState: GameStateTransmit) {
		this.startGameButton.disabled = true;

		this.initParticipants(gameState);
	
		const deck = new Deck(this.centerPosition);
		const universalTimeline = gsap.timeline();
		if (gameState.cardHeap.length === 0) {
			deck.initCards(gameState, this.playerId);
			universalTimeline.add(deck.shuffleAnimation(3));
		}
		else {
		// 	// resynchronize so that the player card hands are immediately in, skip the deck init stuff
			this.cardHeap.sync(gameState.cardHeap);
			for (let i = 0; i < this.participants.length; i++) {
				this.participants[i].sync(gameState);
			}
		}

		const dealingCardsTimeline = gsap.timeline();
		let dealtCards = deck.dealTopCards(1);
		let dealtCardsFinished = false;
		for (let i = 0; dealtCards.length === 1; i++) {
			if (i >= this.participants.length) {
				i = 0;
			}
			let dealtCardAnimation = undefined;
			const participant = this.participants[i];
			if (participant.cardManager.getCardsAmount() < gameState.playerCardsAmount[participant.uuid]) {
				dealtCardAnimation = participant.cardManager.receiveCard(dealtCards[0], 0, 0.3);
				dealtCardsFinished = true;
			}
			if (dealtCardAnimation !== undefined) {
				dealingCardsTimeline.add(dealtCardAnimation, "<+0.05");
			}
			if (dealtCardsFinished === true) {
				dealtCards = deck.dealTopCards(1);
				dealtCardsFinished = false;
			}
		}
		universalTimeline.add(dealingCardsTimeline);
		universalTimeline.eventCallback("onComplete", () => {
			const player = this.participants.find((participant) => participant.uuid === this.playerId);
			if (player !== undefined) {
				player.cardManager.isLocked = false;
			}
			this.cardHeap.cardHandQueue.play();
		})
	}

	private initParticipants(gameState: GameStateTransmit) {
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
				// const target = new THREE.Object3D();
				// target.position.copy(camera.position);
				// target.lookAt(this.cardHeap.originalPosition);
				camera.position.copy(new THREE.Vector3(0, 4.5, 4.5));
				camera.lookAt(this.cardHeap.originalPosition);
				// this.move(camera, new THREE.Vector3(0, 4.5, 4.5), target.quaternion);
				// orbitControls.update();
				// orbitControls.addEventListener("change", () => {
				const offset = new THREE.Vector3(0, -2, -3);
				cameraLight.position.copy(camera.position);
				player.cardManager.updateManager(offset.clone().applyQuaternion(camera.quaternion.clone()).add(camera.position), camera.quaternion.clone());
				// });
				this.participants.push(player);
			}
			else if (id !== this.playerId) {
				const opponent = new Opponent(this.socket, id, this.cardHeap);
				const [pos, rot] = this.tablePosition(i);
				opponent.cardManager.updateManager(pos, rot);
				this.participants.push(opponent);
			}
		}
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

	private tablePosition(seatIndex: number): [THREE.Vector3, THREE.Quaternion] {
		const positions: Array<THREE.Vector3> = [
			new THREE.Vector3(0, 2, 4),
			new THREE.Vector3(0, 1.5, -4),
			new THREE.Vector3(-4, 1.5, 0),
			new THREE.Vector3(4, 1.5, 0),
		];
		const rotations: Array<THREE.Euler> = [
			new THREE.Euler(-Math.PI / 8, 0, 0),
			new THREE.Euler(0, -Math.PI, 0),
			new THREE.Euler(0, -Math.PI / 2, 0),
			new THREE.Euler(0, Math.PI / 2, 0)
		]
		return ([positions[seatIndex], new THREE.Quaternion().setFromEuler(rotations[seatIndex])]);
	}
}