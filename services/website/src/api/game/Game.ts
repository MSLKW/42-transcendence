import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import { type GameStateTransmit, type StatusTransmit, type SeatOrderTransmit, type GameSettingsTransmit, type GameEndStatsTransmit, type AchievementUnlockTransmit, type PlayerTurnTransmit, type SkipTurnTransmit } from '@big2/game-types';
import { CardHeap } from './CardHeap';
import { Player } from './Player';
import { Opponent } from './Opponent';
import { Deck } from './Deck';
import { gameScene } from '../../components/3d/ThreeJsManager';
import { gsap } from 'gsap';
import { Participant } from './Participant';
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { partySocket } from "../party/partySocket";
import { useSceneStore } from "../../store/SceneStore";
import { threejsManager } from '../../App';
import { useResultsStore } from '../../store/ResultsStore';
import { useBotStore } from '../../store/BotStore';
import { useSettingsStore } from '../../store/SettingsStore';
import { useNotificationStore, NOTIFICATION_TYPE } from '../../store/NotificationStore';
import { gameLog } from './main';

export class Game {
	private socket: Socket;
	private centerPosition: THREE.Vector3 = new THREE.Vector3(0, 0.6, 0);
	private cardHeap: CardHeap = new CardHeap(this.centerPosition);
	private playerId: string;
	private participants: Array<Participant>;
	public	playerRef: Player | null;

	private motionCurve: THREE.CatmullRomCurve3;
	private finalCameraPosition: THREE.Vector3;

	constructor(sessionId: string, playerId: string) {
		this.playerId = playerId;
		this.socket = io({
			path: "/socket/game/",
			auth: {
				lobbyId: sessionId,
				uuid: playerId
			},
			reconnection: true,
			reconnectionAttempts: 3,
		})
		if (this.playerId === usePartyStore.getState().hostUuid) {
			this.socket.emit("user_seat_change", useGameStore.getState().totalPlayers, (status: StatusTransmit) => {
				gameLog("[gameSocket] user_seat_change: ", status);
			});
		}

		this.participants = [];
		this.playerRef = null;
		this.finalCameraPosition = new THREE.Vector3(0, 4.5, 4.5);
		this.motionCurve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, 8, 0),
			new THREE.Vector3(0, 7.75, 1),
			new THREE.Vector3(0, 7.20, 2),
			new THREE.Vector3(0, 6.34, 3),
			new THREE.Vector3(0, 5.19, 4),
			this.finalCameraPosition,
		]);

		this.bindSocketEvents();
	}

	public disconnect() {
		this.resetGame();
		this.socket.disconnect();
	}

	public startGame() {
		this.socket.emit("game_start_request", (status: StatusTransmit) => {
			gameLog(`[gameSocket] 'game_start_request': ${status.success} | ${status.message}`);
		});
	}

	public deleteLobby() {
		gameLog("[gameSocket] emitting 'lobby_delete_request");
		this.socket.emit("lobby_delete_request", (status: StatusTransmit) => {
			gameLog(`[gameSocket] 'lobby_delete_request': ${status.success} | ${status.message}`);
			if (status.success === false) {
				this.disconnect();
			}
		});
	}

	public takeSeat(seatIndex: number) {
		this.socket.emit("user_seat_take", seatIndex, (status: StatusTransmit) => {
			gameLog(`[gameSocket] user_seat_take: ${status.success} | ${status.message}`);
		});
	}

	public leaveSeat() {
		this.socket.emit("user_seat_leave", (status: StatusTransmit) => {
			gameLog(`[gameSocket] user_seat_leave: ${status.success} | ${status.message}`);
		});
	}

	public addBot(seatIndex: number) {
		this.socket.emit("bot_add", seatIndex, (status: StatusTransmit) => {
			gameLog(`[gameSocket] 'bot_add': ${status.success} | ${status.message}`);
		});
	}

	public removeBot(botId: string) {
		this.socket.emit("bot_remove", botId, (status: StatusTransmit) => {
			gameLog(`[gameSocket] 'bot_remove': ${status.success} | ${status.message}`);
		});
	}

	public setGameSettings(gameSettings: GameSettingsTransmit) {
		this.socket.emit("game_settings_set", gameSettings, (status: StatusTransmit) => {
			gameLog(`[gameSocket] 'game_settings_set': `, status);
		});
	}

	private bindSocketEvents() {
		this.socket.on("connect_error", (error) => {
			gameLog("[gameSocket] 'connect_error': ", error.message);
			usePartyStore.setState({ partyGameId: null });
			this.disconnect();
		});

		this.socket.on("connect", () => {
			gameLog(`[gameSocket] 'connect' id: ${this.socket.id}`);
			useSceneStore.getState().setCurrentScene("Lobby");
		});

		this.socket.on("graceful_disconnect", (reason: string) => {
			gameLog(`[gameSocket] 'graceful_disconnect' reason: `, reason);
			this.disconnect();
		});

		this.socket.on("disconnect", (reason) => {
			gameLog(`[gameSocket] 'disconnect' reason: ${reason}`);
			const currentScene = useSceneStore.getState().currentScene;
			if (currentScene === "Lobby" || currentScene === "Game") {
				useSceneStore.getState().setCurrentScene("Home");
			}
			this.resetGame();
			useGameStore.getState().resetLobby();
			partySocket.refresh();
		});
	
		this.socket.on("game_end", (gameEndStats: GameEndStatsTransmit) => {
			gameLog(`[gameSocket] 'game_end': `, gameEndStats);
			this.cardHeap.cardHandQueue.add(() => {
				useResultsStore.getState().setResults(gameEndStats);
				useGameStore.setState({ round: gameEndStats.temporaryRoundsPlayed });
				useSceneStore.getState().setCurrentScene("Lobby");
				useSceneStore.getState().setShowWindow("results", true); // doesn't work when setCurrnetScene set to Lobby?
				this.resetGame();
				useGameStore.getState().resetGame();
			}, "+=1");
		});
	
		this.socket.on("player_connection_update", (disconnections: Record<string, boolean>) => {
			useGameStore.setState({ playerDisconnection: disconnections });
			gameLog("[gameSocket] 'player_connection_update': ", disconnections);
		});
	
		this.socket.on("user_seat_update", (seatData: SeatOrderTransmit) => {
			const totalPlayers = useGameStore.getState().totalPlayers;
			gameLog("[gameSocket] 'user_seat_update': ", seatData);
			if (totalPlayers !== seatData.totalSeats) {
				useGameStore.setState({totalPlayers: seatData.totalSeats})
				useGameStore.getState().initSeats();
			}
			useGameStore.setState({userSeats: seatData.seatOrder});
			useBotStore.getState().cacheBotProfile(seatData);
		});
	
		this.socket.on("user_list_update", (userList: Array<string>) => {
			gameLog("[gameSocket] 'user_list_update': ", userList);
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
			gameLog("[gameSocket] 'game_settings_update': ", gameSettings);
			useSettingsStore.getState().update(gameSettings);
		});
	
		this.socket.on("game_state", (gameState: GameStateTransmit) => {
			gameLog("[gameSocket] 'game_state': ", gameState);
			this.resetGame();
			this.initGame(gameState);
		});

		this.socket.on("player_turn", (playerTurn: PlayerTurnTransmit) => {
			gameLog("[gameSocket] 'player_turn': ", playerTurn);
			useGameStore.getState().clearPassedPlayer(playerTurn.playerId);
			const activeSeat = useGameStore.getState().gameSeats.findIndex((uuid) => uuid === playerTurn.playerId);
			useGameStore.setState({
				activeSeat: activeSeat,
				isActiveSeatSkippable: playerTurn.skippable,
				lowestCardRequired: playerTurn.lowestCardRequired,
				playerTimer: playerTurn.timer,
				playerRemainingTimer: playerTurn.remainingTimer
			});
			if (playerTurn.skippable === false) {
				this.cardHeap.signalLeadingPlayer();
			}
			if (this.playerRef) {
				useGameStore.getState().setSelectedCards(this.playerRef.cardManager.selectedCards.transmit());
			}
			useGameStore.getState().setCardHandPlayable();
		});

		this.socket.on("player_skip_turn", (skipTurn: SkipTurnTransmit) => {
			gameLog("[gameSocket] 'player_skip_turn': ", skipTurn);
			const newPlayerPassed = [...useGameStore.getState().playerPassed];
			if (newPlayerPassed.find((skippedUuid) => skippedUuid === skipTurn.playerId) === undefined) {
				newPlayerPassed.push(skipTurn.playerId);
				useGameStore.setState({ playerPassed: newPlayerPassed });
			}
		});

		this.socket.on("player_unlock_achievement", (achievementTransmit: AchievementUnlockTransmit) => {
			gameLog("[gameSocket] 'player_unlock_achievement': ", achievementTransmit);
			useNotificationStore.getState().showNotification(`You've unlocked: ${achievementTransmit.achievementId}`, NOTIFICATION_TYPE.message)
		});
	}

	// private unbindSocketEvents() {
	// 	this.socket.off("player_turn");
	// 	this.socket.off("player_skip_turn");
	// }

	private initGame(gameState: GameStateTransmit) {
		useSceneStore.getState().setShowWindow("results", false);
		this.initParticipants(gameState);
		const seats: string[] = Object.entries(gameState.playerSeatOrder)
			.sort((a, b) => a[1] - b[1])
			.map(([key]) => key);
		useGameStore.setState({ 
			gameSeats: seats,
			totalPlayers: this.participants.length,
			// activeSeat: 
		});
		useGameStore.getState().setCardsLeft(gameState.playerCardsAmount);
		useGameStore.getState().setSeatRef(useGameStore.getState().gameSeats);
		useSceneStore.getState().setCurrentScene("Game");
		if (this.playerRef !== null) {
			this.moveCamera(gameState.initialize);
			gameScene.cameraLight.position.copy(this.finalCameraPosition);
			this.playerRef?.cardManager.updateManager(
				new THREE.Vector3(0, 1, 4), 
				new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 4, 0, 0))
			);
		}
		this.initDeckDealing(gameState);
		useGameStore.setState({ gameStarted: true });
	}

	public resetGame() {
		this.cardHeap.reset();
		for (let i = 0; i < this.participants.length; i++) {
			this.participants[i].reset();
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
			return (distanceA - distanceB);
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
				const [pos, rot] = this.tablePosition(i, totalSeats);
				opponent.cardManager.updateManager(pos, rot);
				this.participants.push(opponent);
			}
		}
	}

	private initDeckDealing(gameState: GameStateTransmit) {
		const deck = new Deck(this.centerPosition);
		const universalTimeline = gsap.timeline();
		if (gameState.initialize === true) {
			deck.initCards(gameState, this.playerId);
			universalTimeline.add(deck.shuffleAnimation(3));
		}
		else {
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

	private moveCamera(initialize: boolean) {
		if (initialize === true) {
			const pathProgress = { progress: 0 };
			gsap.to(pathProgress, {
				progress: 1,
				duration: 3,
				ease: "power2.inOut",
				onUpdate: () => {
					this.motionCurve.getPointAt(pathProgress.progress, threejsManager.camera.position);
					threejsManager.camera.lookAt(this.cardHeap.originalPosition);
				},
			})
		}
		else {
			threejsManager.camera.position.copy(this.finalCameraPosition);
			threejsManager.camera.lookAt(this.cardHeap.originalPosition);
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

	private tablePosition(seatIndex: number, totalPlayers: number): [THREE.Vector3, THREE.Quaternion] {
		let positions: Array<THREE.Vector3> = [];
		let rotations: Array<THREE.Euler> = [];
		if (totalPlayers === 4) {
			positions = [
				new THREE.Vector3(0, 1.5, 4),
				new THREE.Vector3(-4, 1.5, 0),
				new THREE.Vector3(0, 1.5, -4),
				new THREE.Vector3(4, 1.5, 0),
			];
			rotations = [
				new THREE.Euler(0, 0, 0),
				new THREE.Euler(0, -Math.PI / 2, 0),
				new THREE.Euler(0, -Math.PI, 0),
				new THREE.Euler(0, Math.PI / 2, 0),
			];
		}
		else if (totalPlayers === 3) {
			positions = [
				new THREE.Vector3(0, 1.5, 4),
				new THREE.Vector3(-3.5, 1.5, -2.5),
				new THREE.Vector3(3.5, 1.5, -2.5),
			];
			rotations = [
				new THREE.Euler(0, 0, 0),
				new THREE.Euler(0, -Math.PI / 1.5, 0),
				new THREE.Euler(0, Math.PI / 1.5, 0),
			]
		}
		else if (totalPlayers === 2) {
			positions = [
				new THREE.Vector3(0, 1.5, 4),
				new THREE.Vector3(0, 1.5, -4),
			]
			rotations = [
				new THREE.Euler(0, 0, 0),
				new THREE.Euler(0, -Math.PI, 0),
			]
		}
		return ([positions[seatIndex], new THREE.Quaternion().setFromEuler(rotations[seatIndex])]);
	}
}