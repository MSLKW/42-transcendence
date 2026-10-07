import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import { type GameStateTransmit, type StatusTransmit, type SeatOrderTransmit, type GameSettingsTransmit, type GameEndStatsTransmit } from '@big2/game-types';
import { CardHeap } from './CardHeap';
import { Player } from './Player';
import { Opponent } from './Opponent';
import { Deck } from './Deck';
import { gameScene } from '../../components/3d/ThreeJsManager';
import { gsap } from 'gsap';
import { Participant } from './Participant';
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useSceneStore } from "../../store/SceneStore";
import { threejsManager } from '../../App';
import { useResultsStore } from '../../store/ResultsStore';

export class Game {
	private socket: Socket;
	private centerPosition: THREE.Vector3 = new THREE.Vector3(0, 0.6, 0);
	private cardHeap: CardHeap = new CardHeap(this.centerPosition);
	private playerId: string;
	private participants: Array<Participant>;
	public	playerRef: Player | null;

	constructor(sessionId: string, playerId: string) {
		this.playerId = playerId;
		this.socket = io({
			path: "/socket/game/",
			auth: {
				lobbyId: sessionId,
				uuid: playerId
			}
		})
		if (this.playerId === usePartyStore.getState().hostUuid) {
			this.socket.emit("user_seat_change", useGameStore.getState().totalPlayers, (status: StatusTransmit) => {
				console.log("[gameSocket] user_seat_change: ", status);
			});
		}

		this.participants = [];
		this.playerRef = null;

		this.bindSocketEvents();
	}

	public disconnect() {
		this.resetGame();
		this.socket.disconnect();
	}

	public startGame() {
		this.socket.emit("game_start_request", (status: StatusTransmit) => {
			console.log(`[gameSocket] 'game_start_request': ${status.success} | ${status.message}`);
		});
	}

	public deleteLobby() {
		this.socket.emit("delete_lobby_request", (status: StatusTransmit) => {
			console.log(`[gameSocket] 'delete_lobby_request': ${status.success} | ${status.message}`);
		});
	}

	public takeSeat(seatIndex: number) {
		this.socket.emit("user_seat_take", seatIndex, (status: StatusTransmit) => {
			console.log(`[gameSocket] user_seat_take: ${status.success} | ${status.message}`);
		});
	}

	public leaveSeat() {
		this.socket.emit("user_seat_leave", (status: StatusTransmit) => {
			console.log(`[gameSocket] user_seat_leave: ${status.success} | ${status.message}`);
		});
	}

	private bindSocketEvents() {
		this.socket.on("connect_error", (error) => {
			console.log("[gameSocket] 'connect_error': ", error.message);
			usePartyStore.setState({ partyGameId: null });
		});

		this.socket.on("connect", () => {
			console.log(`[gameSocket] 'connect' id: ${this.socket.id}`);
			useSceneStore.getState().setCurrentScene("Lobby");
		});

		this.socket.on("graceful_disconnect", (reason: string) => {
			console.log(`[gameSocket] 'graceful_disconnect' reason: `, reason);
			this.socket.disconnect();
		});

		this.socket.on("disconnect", (reason) => {
			console.log(`[gameSocket] 'disconnect' reason: ${reason}`);
			const currentScene = useSceneStore.getState().currentScene;
			if (currentScene === "Lobby" || currentScene === "Game") {
				useSceneStore.getState().setCurrentScene("Home");
			}
			useGameStore.getState().resetGame();
		});
	
		this.socket.on("game_end", (gameEndStats: GameEndStatsTransmit) => {
			useResultsStore.getState().setResults(gameEndStats);
			useGameStore.setState({ round: gameEndStats.temporaryRoundsPlayed });
			this.resetGame();
			useSceneStore.getState().setCurrentScene("Lobby");
			useSceneStore.getState().setShowWindow("results", true);
		});
	
		this.socket.on("player_connection_update", (disconnections: Record<string, boolean>) => {
			useGameStore.setState({ playerDisconnection: disconnections });
			console.log("[gameSocket] Received 'player_connection_update': ", disconnections);
		});
	
		this.socket.on("user_seat_update", (seatData: SeatOrderTransmit) => {
			const totalPlayers = useGameStore.getState().totalPlayers;
			console.log(`[gameSocket] 'user_seat_update' | totalSeats: ${seatData.totalSeats} | seatOrder: ${seatData.seatOrder}`);
			if (totalPlayers !== seatData.totalSeats) {
				useGameStore.setState({totalPlayers: seatData.totalSeats})
				useGameStore.getState().initSeats();
			}
			useGameStore.setState({userSeats: seatData.seatOrder});
		});
	
		this.socket.on("user_list_update", (userList: Array<string>) => {
			const newUserSeats = [...useGameStore.getState().userSeats];
			for (let i = 0; i < newUserSeats.length; i++) {
				const userInList = userList.find((uuid) => uuid === newUserSeats[i]);
				if (userInList === undefined) {
					newUserSeats[i] = null;
				}
			}
			useGameStore.setState({ userSeats: newUserSeats });
		})

		this.socket.on("game_settings_update", (gameSettings: GameSettingsTransmit) => {
			console.log(gameSettings);
		});
	
		this.socket.on("game_state", (gameState: GameStateTransmit) => {
			console.log("[gameSocket] Received game_state");
			this.resetGame();
			this.initGame(gameState);
		});
	}

	private initGame(gameState: GameStateTransmit) {
		useSceneStore.getState().setShowWindow("results", false);
		this.initParticipants(gameState);
		console.log(gameState.playerSeatOrder);
		const seats: string[] = Object.entries(gameState.playerSeatOrder)
			.sort((a, b) => a[1] - b[1])
			.map(([key]) => key);
		console.log(seats);
		useGameStore.setState({ gameSeats: seats });
		useGameStore.setState({ totalPlayers: this.participants.length });
		useGameStore.getState().setCardsLeft(gameState.playerCardsAmount);
		useGameStore.getState().setSeatRef(useGameStore.getState().gameSeats);
		useSceneStore.getState().setCurrentScene("Game");
		this.moveCamera();
		this.initDeckDealing(gameState);
	}

	public resetGame() {
		this.cardHeap.reset();
		for (let i = 0; i < this.participants.length; i++) {
			this.participants[i].cardManager.reset();
		}
		this.playerRef = null;
		this.participants.length = 0;
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
				this.participants.push(player);
				this.playerRef = player;
			}
			else if (id !== this.playerId) {
				const opponent = new Opponent(this.socket, id, this.cardHeap);
				const [pos, rot] = this.tablePosition(i);
				opponent.cardManager.updateManager(pos, rot);
				this.participants.push(opponent);
			}
		}
	}

	private initDeckDealing(gameState: GameStateTransmit) {
		const deck = new Deck(this.centerPosition);
		const universalTimeline = gsap.timeline();
		if (gameState.cardHeap.length === 0) {
			deck.initCards(gameState, this.playerId);
			universalTimeline.add(deck.shuffleAnimation(3));
		}
		else {
			// resynchronize so that the player card hands are immediately in, skip the deck init stuff
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

	private moveCamera() {
		threejsManager.camera.position.copy(new THREE.Vector3(0, 4.5, 4.5));
		threejsManager.camera.lookAt(this.cardHeap.originalPosition);
		const offset = new THREE.Vector3(0, -2, -3);
		gameScene.cameraLight.position.copy(threejsManager.camera.position);
		this.playerRef?.cardManager.updateManager(offset.clone().applyQuaternion(threejsManager.camera.quaternion.clone()).add(threejsManager.camera.position), threejsManager.camera.quaternion.clone());
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