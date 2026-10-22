import { Socket } from 'socket.io';
import { io } from './server.js';
import { PlayerState } from './PlayerState.js';
import { CardDeckState } from './CardDeckState.js'
import { CardHeapState } from './CardHeapState.js'
import { CardRank, CardSuit, GameStateTransmit, GameEndStatsTransmit, StatusTransmit, PlayerTurnTransmit, SkipTurnTransmit, GameSettingsTransmit, CardHandTransmit, AchievementUnlockTransmit } from '@big2/game-types';
import { UserState } from './UserState.js';
import { EventEmitter } from 'node:events';
import { StatisticsTracker } from './StatisticsTracker.js';
import { AutoPassTimer } from './AutoPassTimer.js';

export class GameState {
	private players: Array<PlayerState>;
	private spectators: Array<UserState>;
	private cardDeck: CardDeckState;
	public	cardHeap: CardHeapState;
	public	isGameStarted: boolean;
	private	playerTurnIndex: number;
	private playerTurnAutoPassTimer: AutoPassTimer | undefined;
	public	gameRoomId: string;
	private	events: EventEmitter;
	private statistics: StatisticsTracker;

	private	previousSeatOrder: string[];
	private	temporaryWinStreakWinnerUuid: string;
	private	temporaryWinStreakAmount: number;
	private	temporaryRoundsPlayed: number;


	// Game Settings
	public	settings: GameSettingsTransmit;
	// Play until last player or when the first player finishes
	// if play until last player finishes, will score based on finishing ranking?
	// if play until first player finishes, will score based on cards held by the losers
	
	constructor(sessionId: string) {
		this.players = [];
		this.spectators = [];
		this.settings = {
			allow3OfAKind: false,
			allow2OfSpadesEnd: false,
			autoPassInMilliseconds: 60000,
		};
		this.cardDeck = new CardDeckState();
		this.cardHeap = new CardHeapState(this.settings);
		this.events = new EventEmitter();
		this.statistics = new StatisticsTracker(this.events);
		this.isGameStarted = false;
		this.playerTurnIndex = -1;
		this.playerTurnAutoPassTimer = undefined;
		this.gameRoomId = "game" + sessionId;
		this.previousSeatOrder = [];
		this.temporaryWinStreakWinnerUuid = "";
		this.temporaryWinStreakAmount = 0;
		this.temporaryRoundsPlayed = 0;

		this.bindGameEventListeners();
	}

	public emit(event: string, payload: any) {
		io.to(this.gameRoomId).emit(event, payload);
	}

	public emitPlayerConnectionUpdate() {
		const playerConnections: Record<string, boolean> = {};
		for (let i = 0; i < this.players.length; i++) {
			playerConnections[this.players[i].uuid] = this.players[i].isDisconnected;
		}
		this.emit("player_connection_update", playerConnections);
	}

	private bindGameEventListeners() {
		this.events.on("player:play_card_hand", (cardHandTransmit: CardHandTransmit) => {
			this.emit("player_play_card_hand", cardHandTransmit);
			for (let i = 0; i < this.players.length; i++) {
				if (this.players[i].cards.length === 0) {
					let winner = this.players[i];
					const newWinner = this.checkLastPlayedTwoSpades(cardHandTransmit, winner);
					this.endGame(newWinner !== undefined ? newWinner : winner);
					return ;
				}
			}
			this.nextPlayerTurn();
		});

		this.events.on("player:skip_turn", (skipTurnTransmit: SkipTurnTransmit) => {
			this.emit("player_skip_turn", skipTurnTransmit);
			this.nextPlayerTurn();
		});

		this.events.on("player:unlock_achievement", (achievementTransmit: AchievementUnlockTransmit) => {
			const player = this.players.find((player) => player.uuid === achievementTransmit.playerUuid);
			if (player === undefined) {
				return ;
			}
			player.socket.emit("player_unlock_achievement", achievementTransmit);
		});
	}

	public addPlayer(user: UserState) {
		const player = new PlayerState(user.uuid, user.socket, this.events, this.cardHeap);
		player.socket.join(this.gameRoomId);
		this.players.push(player);
	}

	public addSpectator(user: UserState) {
		user.socket.join(this.gameRoomId);
		this.spectators.push(user);
		user.socket.on("disconnect", () => {
			const index = this.spectators.indexOf(user);
			if (index >= 0) {
				this.spectators.splice(index, 1);
			}
		});
		if (this.isGameStarted === true) {
			user.socket.emit("game_state", this.transmit(undefined));
			const playerTurnTransmit = this.getPlayerTurnTransmit();
			if (playerTurnTransmit !== undefined) {
				user.socket.emit("player_turn", playerTurnTransmit);
			}
		}
	}
	
	/*
		@param user: Should be the users who want to play in the game
	*/
	public startGame(): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		}
		if (this.players.length === 0) {
			status.message = "No users to start game";
			return (status);
		}
		if (this.isGameStarted === true) {
			status.message = "Game has already started"
			return (status);
		}
		if (this.players.length === 2) {
			this.players[0].collectCards(this.cardDeck.dealCards(17));
			this.players[1].collectCards(this.cardDeck.dealCards(17));
		}
		else {
			for (let i = 0; i < this.players.length; i++) {
				this.players[i].collectCards(this.cardDeck.dealCards(Math.floor(this.cardDeck.size / this.players.length)));
			}
		}
		// determine who is first and who gets the cards
		const lowest = this.getLowestPlayerCard();
		if (lowest === undefined) {
			status.message = "Couldn't find lowest player card";
			return (status);
		}
		const [lowestPlayer, lowestCardRank, lowestCardSuit] = lowest;
		if (this.players.length === 3 && this.cardDeck.size === 1) {
			lowestPlayer.collectCards(this.cardDeck.dealCards(1));
		}
		if (this.players.length === 2) {
			this.cardHeap.setLowestCard(lowestCardRank, lowestCardSuit);
		}
		this.playerTurnIndex = this.players.findIndex((player) => player === lowestPlayer);
		if (this.playerTurnIndex === -1)
			this.playerTurnIndex = 0;
		this.togglePlayerTurnFlag(this.players[this.playerTurnIndex]);
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].socket.emit("game_state", this.transmit(this.players[i]));
		}
		for (let i = 0; i < this.spectators.length; i++) {
			this.spectators[i].socket.emit("game_state", this.transmit(undefined));
		}
		this.statistics.setupPlayerTracker(this.players);
		this.startPlayerTurn();
		this.isGameStarted = true;
		console.log(`Game<${this.gameRoomId}> has started`);
		status.success = true;
		status.message = "Game has successfully started";
		return (status);
	}

	private getLowestPlayerCard(): [PlayerState, CardRank, CardSuit] | undefined {
		for (let rank = CardRank.Three; rank <= CardRank.Two; rank++) {
			for (let suit = CardSuit.Diamond; suit <= CardSuit.Spade; suit++) {
				for (let i = 0; i < this.players.length; i++) {
					if (PlayerState.hasCard(this.players[i].cards, rank, suit)) {
						return ([this.players[i], rank, suit]);
					}
				}
			}
		}
		return (undefined);
	}

	public endGame(winner: PlayerState) {
		console.log(`Game<${this.gameRoomId}> has ended | Winner is Player<${winner.uuid}>`);
		this.trackTemporaryStats(winner);
		const gameEndStats: GameEndStatsTransmit = {
			uuid: crypto.randomUUID(),
			winnerPlayerUuid: winner.uuid,
			playerFinalCardAmounts: this.getPlayerCardsAmount(),
			playerPenaltyPoints: this.getPlayerPenaltyPoints(),
			playerXpGains: this.statistics.getPlayerXpGains(),
			temporaryWinStreakAmount: this.temporaryWinStreakAmount,
			temporaryRoundsPlayed: this.temporaryRoundsPlayed,
		}
		this.resetGame();
		this.isGameStarted = false;
		this.events.emit("game:end", gameEndStats);
		this.emit("game_end", gameEndStats);
	}

	private resetGame() {
		this.cardHeap.reset();
		this.cardDeck.reset();
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].reset();
		}
		this.players.length = 0;
		this.playerTurnAutoPassTimer?.clear();
		this.playerTurnAutoPassTimer = undefined;
		this.playerTurnIndex = -1;
	}

	private getSeatOrder() {
		const seatOrder: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			seatOrder[this.players[i].uuid] = i;
		}
		return (seatOrder);
	}
	
	private trackTemporaryStats(winner: PlayerState) {
		let resetPreviousSeatOrder: boolean = false;
		if (this.previousSeatOrder.length === 0) {
			resetPreviousSeatOrder = true;
		}
		for (let i = 0; i < this.previousSeatOrder.length; i++) {
			if (this.previousSeatOrder[i] !== this.players[i].uuid) {
				resetPreviousSeatOrder = true;
				break ;
			}
		}
		if (resetPreviousSeatOrder === true) {
			this.temporaryWinStreakWinnerUuid = "";
			this.temporaryWinStreakAmount = 0;
			this.temporaryRoundsPlayed = 0;
			for (let i = 0; i < this.players.length; i++) {
				this.previousSeatOrder[i] = this.players[i].uuid;
			}
		}
		
		if (this.temporaryWinStreakWinnerUuid !== winner.uuid) {
			this.temporaryWinStreakWinnerUuid = winner.uuid;
			this.temporaryWinStreakAmount = 0;
		}
		this.temporaryWinStreakAmount++;
		this.temporaryRoundsPlayed++;
	}

	public uuidInGame(uuid: string): boolean {
		const player = this.players.find((player) => player.uuid === uuid);
		if (player === undefined) {
			return (false);
		}
		return (true);
	}

	public playerReconnect(user: UserState) {
		const player = this.players.find((player) => player.uuid === user.uuid);
		if (player === undefined) {
			return ;
		}
		player.reconnect(user, this);
		player.socket.join(this.gameRoomId);
		this.emitPlayerConnectionUpdate();
	}

	public playerDisconnect(user: UserState) {
		const player = this.players.find((player) => player.uuid === user.uuid);
		if (player === undefined) {
			return ;
		}
		player.disconnect(this);
		this.emitPlayerConnectionUpdate();
	}

	private startPlayerTurn() {
		const player = this.players.at(this.playerTurnIndex);
		if (player === undefined || player.isDisconnected === true) {
			this.nextPlayerTurn();
			return ;
		}
		this.togglePlayerTurnFlag(player);
		if (this.cardHeap.isPlayerLeading(player.uuid) === true) {
			const topCardHand = this.cardHeap.getTopCardHand();
			if (topCardHand !== undefined && topCardHand.playerId === player.uuid) {
				this.events.emit("player:bested", topCardHand.transmit());
			}
		}
		if (this.settings.autoPassInMilliseconds > 0) {
			this.playerTurnAutoPassTimer = new AutoPassTimer(() => {player.skipTurn()}, this.settings.autoPassInMilliseconds);
		}
		const playerTurnTransmit = this.getPlayerTurnTransmit();
		if (playerTurnTransmit !== undefined) {
			this.emit("player_turn", playerTurnTransmit);
		}
	}

	public getPlayerTurnTransmit(): PlayerTurnTransmit | undefined {
		const player = this.players.at(this.playerTurnIndex);
		if (player === undefined)
			return (undefined);
		const playerTurnTransmit: PlayerTurnTransmit = {
			playerId: player.uuid,
			skippable: !this.cardHeap.isPlayerLeading(player.uuid),
			timer: this.settings.autoPassInMilliseconds,
			remainingTimer: this.playerTurnAutoPassTimer?.getRemainingTime() ?? 0
		}
		return (playerTurnTransmit);
	}
	
	public nextPlayerTurn() {
		this.playerTurnAutoPassTimer?.clear();
		this.playerTurnAutoPassTimer = undefined;
		const availablePlayer = this.players.find((player) => player.isDisconnected === false)
		if (availablePlayer === undefined) {
			return ;
		}
		this.playerTurnIndex++;
		if (this.playerTurnIndex >= this.players.length)
			this.playerTurnIndex = 0;
		this.startPlayerTurn();
	}
	
	private	togglePlayerTurnFlag(player: PlayerState) {
		if (player === undefined) {
			return ;
		}
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].isMyTurn = false;
		}
		player.isMyTurn = true;
	}

	private getPlayerCardsAmount() {
		const playerCardsAmount: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			playerCardsAmount[this.players[i].uuid] = this.players[i].cards.length;
		}
		return (playerCardsAmount);
	}

	private getPlayerPenaltyPoints() {
		const playerPenaltyPoints: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			playerPenaltyPoints[this.players[i].uuid] = this.players[i].calculatePenaltyPoints();
		}
		return (playerPenaltyPoints);
	}

	public getDisconnectedPlayers(): number {
		let disconnectedPlayers = 0;
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].isDisconnected === true)
				disconnectedPlayers++;
		}
		return (disconnectedPlayers);
	}

	private checkLastPlayedTwoSpades(cardHandTransmit: CardHandTransmit, winner: PlayerState): PlayerState | undefined {
		if (this.settings.allow2OfSpadesEnd === false) {
			const isFinalPlayer = winner.uuid === cardHandTransmit.playerId;
			const playedTwoSpades = cardHandTransmit.cards.find((card) => card.rank === CardRank.Two && card.suit === CardSuit.Spade) !== undefined;
			if (isFinalPlayer && playedTwoSpades) {
				winner.playedTwoSpadesLast = true;
				let leastCardsPlayedAmount = Infinity;
				let leastCardsPlayedPlayer = undefined;
				for (let i = 0; i < this.players.length; i++) {
					if (this.players[i].cards.length < leastCardsPlayedAmount && this.players[i] !== winner) {
						leastCardsPlayedAmount = this.players[i].cards.length;
						leastCardsPlayedPlayer = this.players[i];
					}
				}
				return(leastCardsPlayedPlayer);
			}
		}
		return (undefined);
	}

	public transmit(player: PlayerState | undefined) {
		const transmitObject: GameStateTransmit = {
			cardHeap: this.cardHeap.transmit(),
			playerCardsAmount: this.getPlayerCardsAmount(),
			playerSeatOrder: this.getSeatOrder(),
			playerCards: [],
			isPlayerTurn: false,
			initialize: !this.isGameStarted,
		}
		if (player !== undefined) {
			transmitObject.playerCards = player.cards;
			transmitObject.isPlayerTurn = player.isMyTurn;
		}
		return (transmitObject);
	}
}