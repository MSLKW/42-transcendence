import { Socket } from 'socket.io';
import { io } from './server.js';
import { PlayerState } from './PlayerState.js';
import { CardDeckState } from './CardDeckState.js'
import { CardHeapState } from './CardHeapState.js'
import { CardRank, CardSuit, GameStateTransmit, GameEndStatsTransmit, StatusTransmit, PlayerTurnTransmit, GameStartRequest, SkipTurnTransmit, CardTransmit, GameSettingsTransmit } from '@big2/game-types';
import { UserState } from './UserState.js';

export class GameState {
	private players: Array<PlayerState>;
	private spectators: Array<UserState>;
	private cardDeck: CardDeckState;
	public	cardHeap: CardHeapState;
	public	isGameStarted: boolean;
	private	playerTurnIndex: number;
	private playerTurnTimeoutId: NodeJS.Timeout | undefined;
	public	gameRoomId: string;

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
		this.cardDeck = new CardDeckState();
		this.cardHeap = new CardHeapState();
		this.isGameStarted = false;
		this.playerTurnIndex = -1;
		this.playerTurnTimeoutId = undefined;
		this.gameRoomId = "game" + sessionId;
		this.settings = {
			allow3OfAKind: true,
			allow2OfSpadesEnd: false,
			autoPassInMilliseconds: 60000,
			endGameCondition: 0,
			scoreCalculation: 0,
		};
		this.previousSeatOrder = [];
		this.temporaryWinStreakWinnerUuid = "";
		this.temporaryWinStreakAmount = 0;
		this.temporaryRoundsPlayed = 0;
	}

	public emit(event: string, payload: any) {
		io.to(this.gameRoomId).emit(event, payload);
	}

	public emitPlayerList() {
		const playerConnections: Record<string, boolean> = {};
		for (let i = 0; i < this.players.length; i++) {
			playerConnections[this.players[i].uuid] = this.players[i].isDisconnected;
		}
		this.emit("player_connection_update", playerConnections);
	}

	public addPlayer(user: UserState) {
		const player = new PlayerState(user.uuid, user.socket, this)
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
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].collectCards(this.cardDeck.dealCards(Math.floor(this.cardDeck.size / this.players.length)));
		}
		for (let i = 0; i < this.players.length; i++) {
			if (PlayerState.hasCard(this.players[i].cards, CardRank.Three, CardSuit.Diamond)) {
				this.playerTurnIndex = i;
				if (this.players.length === 3) { 
					this.players[i].collectCards(this.cardDeck.dealCards(1));
				}
			}
		}
		// If last card is three of diamonds, then give it to three of clubs holder
		const cardsLeft = this.cardDeck.dealCards(1);
		if (cardsLeft.length === 1) {
			for (let i = 0; i < this.players.length; i++) {
				if (PlayerState.hasCard(this.players[i].cards, CardRank.Three, CardSuit.Club)) {
					this.players[i].collectCards(cardsLeft)
					this.playerTurnIndex = i;
				}
			}
		}
		if (this.playerTurnIndex === -1)
			this.playerTurnIndex = 0;
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].socket.emit("game_state", this.transmit(this.players[i]));
		}
		for (let i = 0; i < this.spectators.length; i++) {
			this.spectators[i].socket.emit("game_state", this.transmit(undefined));
		}
		this.playerTurnEvent();
		this.isGameStarted = true;
		console.log(`Game<${this.gameRoomId}> has started`);
		status.success = true;
		status.message = "Game has successfully started";
		return (status);
	}

	public endGame(winner: PlayerState) {
		console.log(`Game<${this.gameRoomId}> has ended | Winner is Player<${winner.uuid}>`);
		this.trackTemporaryStats(winner);
		const gameEndStats: GameEndStatsTransmit = {
			winnerPlayerUuid: winner.uuid,
			playerFinalCardAmounts: this.getPlayerCardsAmount(),
			playerPenaltyPoints: this.getPlayerPenaltyPoints(),
			temporaryWinStreakAmount: this.temporaryWinStreakAmount,
			temporaryRoundsPlayed: this.temporaryRoundsPlayed,
		}
		this.resetGame();`	`
		this.isGameStarted = false;
		this.emit("game_end", gameEndStats);
	}

	private resetGame() {
		this.cardHeap.reset();
		this.cardDeck.reset();
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].reset();
		}
		this.players.length = 0;
		clearTimeout(this.playerTurnTimeoutId);
		this.playerTurnTimeoutId = undefined;
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
		player.reconnect(user);
		this.emitPlayerList();
	}

	public playerDisconnect(user: UserState) {
		const player = this.players.find((player) => player.uuid === user.uuid);
		if (player === undefined) {
			return ;
		}
		player.disconnect();
		this.emitPlayerList();
	}

	private playerTurnEvent() {
		const player = this.players.at(this.playerTurnIndex);
		if (player === undefined || player.isDisconnected === true) {
			this.nextPlayerTurn();
			return ;
		}
		const playerTurnTransmit: PlayerTurnTransmit = {
			playerId: player.uuid,
			skippable: !this.cardHeap.isPlayerLeading(player.uuid),
			timer: this.settings.autoPassInMilliseconds
		}
		if (this.settings.autoPassInMilliseconds > 0) {
			this.playerTurnTimeoutId = setTimeout(() => {this.playerTimeout(player)}, this.settings.autoPassInMilliseconds);
		}
		this.emit("player_turn", playerTurnTransmit);
	}

	private playerTimeout(player: PlayerState) {
		const status: StatusTransmit = {
			success: true,
			message: "Timer ran out"
		}
		player.socket.emit("player_skip_turn_request", status);
		player.skipTurn();
	}

	public nextPlayerTurn() {
		clearTimeout(this.playerTurnTimeoutId);
		this.playerTurnTimeoutId = undefined;
		const availablePlayer = this.players.find((player) => player.isDisconnected === false)
		if (availablePlayer === undefined) {
			return ;
		}
		this.playerTurnIndex++;
		if (this.playerTurnIndex >= this.players.length)
			this.playerTurnIndex = 0;
		this.playerTurnEvent();
	}

	public isPlayerTurn(player: PlayerState) {
		if (this.players.indexOf(player) === this.playerTurnIndex) {
			return (true);
		}
		return (false);
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

	public transmit(player: PlayerState | undefined) {
		const transmitObject: GameStateTransmit = {
			cardHeap: this.cardHeap.transmit(),
			playerCardsAmount: this.getPlayerCardsAmount(),
			playerSeatOrder: this.getSeatOrder(),
			playerCards: [],
			isPlayerTurn: false
		}
		if (player !== undefined) {
			transmitObject.playerCards = player.cards;
			transmitObject.isPlayerTurn = this.isPlayerTurn(player);
		}
		return (transmitObject);
	}
}