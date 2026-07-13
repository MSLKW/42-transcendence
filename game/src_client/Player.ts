import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { CardTransmit, GameEndStatsTransmit, GameStateTransmit, PlayerTurnTransmit, StatusTransmit, SkipTurnTransmit } from '../src_shared/Types.ts';
import { CardHand } from './CardHand.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHeap } from './CardHeap.ts';
import { scene, renderer, camera, gameStatus } from './main.ts';

export class Player {
	private	socket: Socket;
	private playerId: string;
	public	cardManager: CardManager;
	private cardHeapRef: CardHeap;
	private raycaster: THREE.Raycaster;

	private sendCardsButton: HTMLButtonElement;
	private skipTurnButton: HTMLButtonElement;
	private sortCardsByRankButton: HTMLButtonElement;
	private sortCardsBySuitButton: HTMLButtonElement

	constructor(socket: Socket, playerId: string, cardHeapRef: CardHeap) {
		this.socket = socket;
		this.cardHeapRef = cardHeapRef;
		this.playerId = playerId;
		this.raycaster = new THREE.Raycaster();

		this.sendCardsButton = document.getElementById('send-cards-button') as HTMLButtonElement;
		this.skipTurnButton = document.getElementById('skip-turn-button') as HTMLButtonElement;
		this.sortCardsByRankButton = document.getElementById('sort-cards-by-rank-button') as HTMLButtonElement;
		this.sortCardsBySuitButton = document.getElementById('sort-cards-by-suit-button') as HTMLButtonElement;

		this.cardManager = new CardManager(this.playerId);

		if (this.sendCardsButton === undefined || 
			this.skipTurnButton === undefined || 
			this.sortCardsByRankButton === undefined ||
			this.sortCardsBySuitButton === undefined) {
			console.error("Player could not get HTML buttons");
			return ;
		}
		this.setupListeners();
		this.setPlayerTurnUI(false);
	}

	public getPlayerId() {
		return (this.playerId);
	}

	public setupGameState(gameState: GameStateTransmit) {
		this.cardHeapRef.sync(gameState.cardHeap);
		this.collectCards(gameState.playerCards);
		this.setPlayerTurnUI(gameState.isPlayerTurn);
	}

	private setupListeners() {
		this.socket.on('game_end', (gameEndStats: GameEndStatsTransmit) => {
			this.cardManager.reset();
			this.cardHeapRef.reset();
			gameStatus.setGameStats(gameEndStats, this);
			gameStatus.setLightboxActive(true);
			console.log(gameEndStats);
		})
		
		this.socket.on('player_play_card_hand', (status: StatusTransmit) => {
			if (status.success === true) {
				const cardHand = this.cardManager.sendSelectedCards();
				this.cardHeapRef.receiveCardHand(cardHand);
			} else {
				console.log(`player_play_card_hand error: ${status.message}`);
			}
		});
		
		this.socket.on('player_turn', (playerTurn: PlayerTurnTransmit) => {
			if (this.playerId === playerTurn.playerId) {
				this.setPlayerTurnUI(true, playerTurn.skippable);
			}
			else {
				this.setPlayerTurnUI(false);
			}
			console.log(`It is now Player<${playerTurn.playerId}>'s turn! Timer is set at ${playerTurn.timer} seconds!`);
		});

		this.socket.on('player_skip_turn_request', (status: StatusTransmit) => {
			if (status.success === false) {
				console.log(`player_skip_turn_request message: ${status.message}`);
			}
		})

		this.socket.on('player_skip_turn', (skipTurn: SkipTurnTransmit) => {
			console.log(`Player<${skipTurn.playerId}> skipped their turn!`);
		});

		this.sendCardsButton.addEventListener('click', () => {
			const cardHandTransmit = this.cardManager.selectedCards.transmit();
			this.socket.emit('player_play_card_hand', cardHandTransmit);
		});
		
		this.skipTurnButton.addEventListener('click', () => {
			this.socket.emit('player_skip_turn_request');
		});

		this.sortCardsByRankButton.addEventListener('click', () => {
			this.cardManager.sortCards((a, b) => a.rank - b.rank);
		});

		this.sortCardsBySuitButton.addEventListener('click', () => {
			this.cardManager.sortCards((a, b) => a.suit - b.suit);
		});

		renderer.domElement.addEventListener('click', (event) => {
			this.eventClick(event);
		});

		window.addEventListener('pointermove', (event) => {
			this.eventHover(event);
		})
	}

	private eventClick(event: PointerEvent) {
		const canvas = renderer.domElement.getBoundingClientRect();
		const mouse = new THREE.Vector2(
			((event.clientX - canvas.left) / canvas.width) * 2 - 1,
			-((event.clientY - canvas.top) / canvas.height) * 2 + 1
		);
		this.raycaster.setFromCamera(mouse, camera);
		this.cardManager.interactCard(this.raycaster);
	}

	private eventHover(event: PointerEvent) {
		const canvas = renderer.domElement.getBoundingClientRect();
		const mouse = new THREE.Vector2(
			((event.clientX - canvas.left) / canvas.width) * 2 - 1,
			-((event.clientY - canvas.top) / canvas.height) * 2 + 1
		);
		this.raycaster.setFromCamera(mouse, camera);
		this.cardManager.hoverCard(this.raycaster);
	}

	private setPlayerTurnUI(isTurn: boolean, skippable: boolean = true) {
		if (isTurn === true) {
			this.sendCardsButton.disabled = false;
			this.skipTurnButton.disabled = !skippable;
		}
		else {
			this.sendCardsButton.disabled = true;
			this.skipTurnButton.disabled = true;
		}
	}

	private collectCards(cardTransmits: Array<CardTransmit>) {
		for (let i = 0; i < cardTransmits.length; i++) {
			let card = new Card(cardTransmits[i].rank, cardTransmits[i].suit);
			this.cardManager.receiveCard(card);
		}
	}
}