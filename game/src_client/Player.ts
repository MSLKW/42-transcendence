import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { CardTransmit, GameEndStatsTransmit, GameStateTransmit } from '../src_shared/Types.ts';
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
	private startGameButton: HTMLButtonElement;
	private sortCardsByRankButton: HTMLButtonElement;
	private sortCardsBySuitButton: HTMLButtonElement

	constructor(socket: Socket, playerId: string, cardHeapRef: CardHeap) {
		this.socket = socket;
		this.cardHeapRef = cardHeapRef;
		this.playerId = playerId;
		this.raycaster = new THREE.Raycaster();

		this.sendCardsButton = document.getElementById('send-cards-button') as HTMLButtonElement;
		this.skipTurnButton = document.getElementById('skip-turn-button') as HTMLButtonElement;
		this.startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;
		this.sortCardsByRankButton = document.getElementById('sort-cards-by-rank-button') as HTMLButtonElement;
		this.sortCardsBySuitButton = document.getElementById('sort-cards-by-suit-button') as HTMLButtonElement;

		this.cardManager = new CardManager(this.playerId);

		if (this.sendCardsButton === undefined || 
			this.skipTurnButton === undefined || 
			this.startGameButton === undefined ||
			this.sortCardsByRankButton === undefined ||
			this.sortCardsBySuitButton === undefined) {
			console.error("Player could not get HTML buttons");
			return ;
		}
		this.setupListeners();
		this.isPlayerTurn(false);
	}

	public getPlayerId() {
		return (this.playerId);
	}

	private setupListeners() {
		this.socket.on('game_start', (status) => {
			console.log(`Start Game: ${status}`);
			this.startGameButton.disabled = true;
		});
		
		this.socket.on('game_end', (body) => {
			const gameEndStats = JSON.parse(body) as GameEndStatsTransmit;
			this.cardManager.reset();
			this.cardHeapRef.reset();
			this.startGameButton.disabled = false;
			gameStatus.setGameStats(gameEndStats, this);
			gameStatus.setLightboxActive(true);
			console.log(body);
		})
		
		this.socket.on('player_play_card_hand', (status) => {
			if (status === 'success') {
				const cardHand = this.cardManager.sendSelectedCards();
				this.cardHeapRef.receiveCardHand(cardHand);
				this.isPlayerTurn(false);
			}
			else {
				console.log(`playCardHand status: ${status}`);
			}
		});
		
		this.socket.on('player_turn', () => {
			this.isPlayerTurn(true);
			console.log('This player\'s is our turn!');
		});

		this.socket.on('player_skip_turn', (status) => {
			if (status == "success") {
				this.isPlayerTurn(false);
			}
		})

		this.socket.on("player_game_state", (gameStateJSON) => {
			const gameState = JSON.parse(gameStateJSON) as GameStateTransmit;

			this.cardHeapRef.sync(gameState.cardHeap);
			this.collectCards(gameState.playerCards);
			this.isPlayerTurn(gameState.isPlayerTurn);
		});

		this.sendCardsButton.addEventListener('click', () => {
			const cardsJson: string = this.cardManager.selectedCardsToJSON();
			this.socket.emit('player_play_card_hand', cardsJson);
		});
		
		this.skipTurnButton.addEventListener('click', () => {
			this.socket.emit('player_skip_turn');
		});
		
		this.startGameButton.addEventListener('click', () => {
			this.socket.emit('game_start', this.playerId);
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

	private isPlayerTurn(isTurn: boolean) {
		if (isTurn === true) {
			this.sendCardsButton.disabled = false;
			this.skipTurnButton.disabled = false;
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