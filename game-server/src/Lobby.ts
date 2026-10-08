import { Socket } from 'socket.io';
import { io, kickSocket, LobbyRequest } from './server.js';
import { UserState } from './UserState.js';
import { GameState } from './GameState.js';
import { GameSettingsTransmit, SeatOrderTransmit, StatusTransmit } from '@big2/game-types';
import { EventEmitter } from 'node:events';
import { randomBytes } from 'crypto';
import { GAME_BOT_SERVICE_URL } from './server.js';

export class Lobby {
	private hostUuid: string;
	public	sessionId: string;
	public	lobbyRoomId: string;
	public	game: GameState;

	private totalUsersLimit: number;
	private totalSeats: number;
	private whitelist: Array<string>;
	private users: Array<UserState>;
	public	availableSeats: Array<number>;

	public	events: EventEmitter;
	public	botSessions: Record<string, string>;

	private	lobbyTimeoutId: NodeJS.Timeout | undefined;
	private lobbyTimeoutMilliseconds: number;

	constructor(data: LobbyRequest, sessionId: string) {
		this.hostUuid = data.hostUuid;
		this.users = [];
		this.whitelist = data.playerUuids;
		this.totalSeats = 0;
		this.availableSeats = [];
		this.totalUsersLimit = process.env.LOBBY_USER_LIMIT && Number(process.env.LOBBY_USER_LIMIT) > 4 ? Number(process.env.LOBBY_USER_LIMIT) : 4;
		this.lobbyTimeoutMilliseconds = process.env.LOBBY_DELETE_TIMEOUT_MS ? Number(process.env.LOBBY_DELETE_TIMEOUT_MS) : -1;
		this.sessionId = sessionId;
		this.events = new EventEmitter();
		this.game = new GameState(this.sessionId);
		this.lobbyRoomId = "lobby" + this.sessionId;
		this.lobbyTimeoutId = undefined;
		this.botSessions = {}
		this.initSeats(this.totalSeats, this.hostUuid);
	}

	/* Public Getters */

	public getHostUuid() {
		return (this.hostUuid);
	}

	public isActive() {
		return (this.users.length > 0);
	}

	/* --- */

	public emit(event: string, payload: any) {
		io.to(this.lobbyRoomId).emit(event, payload);
	}

	public getSeatOrder(): (string | null)[] {
		const seatOrder: (string | null)[] = [];
		for (let i = 0; i < this.totalSeats; i++) {
			const seatedUser = this.users.find((user) => user.seat === i);
			if (seatedUser !== undefined) {
				seatOrder.push(seatedUser.uuid);
			}
			else {
				seatOrder.push(null);
			}
		}
		return (seatOrder);
	}

	public getSeatData() {
		const seatData: SeatOrderTransmit = {
			totalSeats: this.totalSeats,
			seatOrder: this.getSeatOrder()
		}
		return (seatData);
	}

	public emitSeatOrder() {
		this.emit("user_seat_update", this.getSeatData());
	}

	public emitUserList() {
		const userUuidList: Array<string> = [];
		for (let i = 0; i < this.users.length; i++) {
			userUuidList.push(this.users[i].uuid);
		}
		this.emit("user_list_update", userUuidList);
	}

	public connectUser(socket: Socket, uuid: string) {
		if (this.whitelist.indexOf(uuid) === -1 || 
			this.users.length >= this.totalUsersLimit || 
			(this.game.uuidInGame(uuid) === false && this.users.length >= this.totalUsersLimit - this.game.getDisconnectedPlayers())) {
			let reason = `User<${uuid}> is not allowed to connect`;
			if (this.whitelist.indexOf(uuid) === -1) {
				reason = `${uuid} is not in whitelist`;
			}
			else if (this.users.length >= this.totalUsersLimit) {
				reason = `total users is more than total user limit`;
			}
			else if (this.game.uuidInGame(uuid) === false && this.users.length >= this.totalUsersLimit - this.game.getDisconnectedPlayers()) {
				reason = "user is not in game and the user length >= totalUesrslimit - disconnected players";
			}
			kickSocket(socket, reason);
			return ;
		}
		
		const user = new UserState(socket, uuid, this);

		const userInLobby = this.users.find((user) => user.uuid === uuid);
		if (userInLobby !== undefined) {
			kickSocket(userInLobby.socket, "Kicking old user because new user is logging in");
			user.seat = userInLobby.seat;
		}
		this.users.push(user);
		console.log(`Lobby<${this.sessionId}>: User<${user.uuid}> has connected`);
		clearTimeout(this.lobbyTimeoutId);
		this.emitUserList();
		user.socket.emit("user_seat_update", this.getSeatData());

		if (this.game.uuidInGame(user.uuid) === true) {
			this.game.playerReconnect(user);
		}
		else if (this.game.isGameStarted === true) {
			this.game.addSpectator(user);
		}
		this.bindUserSocketEvents(user);
	}

	private bindUserSocketEvents(user: UserState) {
		user.socket.on("disconnect", () => {
			this.disconnectUser(user);
		});

		user.socket.on("game_start_request", (statusCallback) => {
			statusCallback(this.GameStartRequest(user));
		});

		user.socket.on("user_seat_change", (totalSeats: number, statusCallback) => {
			statusCallback(this.initSeats(totalSeats, user.uuid));
		});

		user.socket.on("game_settings_set", (gameSettings: GameSettingsTransmit, statusCallback) => {
			const status = this.GameSetSettings(user, gameSettings);
			user.socket.emit("game_settings_set", status);
			if (status.success === true) {
				this.emit("game_settings_update", this.game.settings);
			}
			statusCallback(status);
		});

		user.socket.on("lobby_delete_request", (statusCallback) => {
			const status: StatusTransmit = {
				success: false,
				message: "",
			};
			if (user.uuid !== this.hostUuid) {
				status.message = "Not the Host";
				statusCallback(status);
				return (status);
			}
			else if (this.game.isGameStarted === true) {
				status.message = "Lobby game has already started";
				statusCallback(status);
				return ;
			}
			status.success = true;
			status.message = "Successfully deleted the lobby";
			statusCallback(status);
			this.events.emit("lobby:delete");
		});

		user.socket.on("bot_add", async (seatIndex: number, statusCallback) => {
			statusCallback(await this.AddBot(user, seatIndex));
		});

		user.socket.on("bot_remove", (botId: string, statusCallback) => {
			statusCallback(this.removeBot(botId));
		});
	}

	private disconnectUser(disconnectedUser: UserState) {
		const index = this.users.findIndex((user) => user.uuid === disconnectedUser.uuid);
		if (index === -1) {
			console.log(`Disconnecting user is not found in users`);
			return ;
		}
		if (this.game.isGameStarted === true && this.game.uuidInGame(disconnectedUser.uuid)) {
			this.game.playerDisconnect(disconnectedUser);
		}
		disconnectedUser.leaveSeat();
		this.users.splice(index, 1);
		this.emitUserList();
		console.log(`Lobby<${this.sessionId}>: User<${disconnectedUser.uuid}> has disconnected`);
		if (this.isActive() === false) {
			if (this.lobbyTimeoutMilliseconds > 0) {
				this.lobbyTimeoutId = setTimeout(() => {
					this.events.emit("lobby:delete");
				}, this.lobbyTimeoutMilliseconds);
				console.log(`Lobby<${this.sessionId}> is inactive`);
			}
		}
	}

	private GameStartRequest(user: UserState): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		}
		if (this.hostUuid !== user.uuid) {
			status.message = "You are not the host";
			return (status);
		}
		const usersToPlay = this.users.filter((user) => user.seat >= 0).sort((userA, userB) => userA.seat - userB.seat);
		if (usersToPlay.length !== this.totalSeats) {
			status.message = "Lobby is not fully seated with players";
			return (status);
		}
		for (let i = 0; i < usersToPlay.length; i++) {
			this.game.addPlayer(usersToPlay[i]);
		}
		const userSpectators = this.users.filter((user) => user.seat === -1);
		for (let i = 0; i < userSpectators.length; i++) {
			this.game.addSpectator(userSpectators[i]);
		}
		return (this.game.startGame());
	}

	public GameSetSettings(user: UserState, settings: GameSettingsTransmit): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		}
		if (this.hostUuid !== user.uuid) {
			status.message = "Not the host";
			return (status);
		}
		this.game.settings = settings;
		status.success = true;
		status.message = "Successfully set game settings";
		return (status);
	}

	private async AddBot(user: UserState, seatIndex: number): Promise<StatusTransmit> {
		const status: StatusTransmit = {
			success: false,
			message: ""
		}
		if (user.uuid !== this.hostUuid) {
			status.message = "You are not the host";
			return (status);
		}
		const availableSeat = this.availableSeats.find((availableSeatIndex) => availableSeatIndex === seatIndex);
		if (availableSeat === undefined) {
			status.message = "The seat is not available";
			return (status);
		}

		const newSessionToken = randomBytes(32).toString("hex");
		try {
			const response = await fetch(`${GAME_BOT_SERVICE_URL}/new-bot`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					lobbyId: this.sessionId,
					seatIndex: seatIndex,
					botSessionToken: newSessionToken
				})
			});
			
			if (response.status === 400) {
				const payload = await response.json();
				status.message = `Unable to add bot: ${payload.error}`;
				return (status);
			}
			if (!response.ok) {
				status.message = `game-bot service error`;
				return (status);
			}

			const payload = await response.json();

			if (response.status !== 200) {
				status.message = "Unknown response status";
				return (status);
			}

			const botId = payload.botId;
			this.botSessions[newSessionToken] = botId;
			this.whitelist.push(botId);
			status.success = true;
			status.message = `Successfully added bot: ${botId}`;
			return (status);
		}
		catch (error) {
			if (error instanceof TypeError) {
				status.message = "Network error: game-bot server may be down";
			}
			else {
				status.message = "Error occured while adding bot";
			}
			return (status);
		}
	}

	private removeBot(botId: string): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		}
		const botUser = this.users.find((userUuid) => userUuid.uuid === botId);
		if (botUser === undefined) {
			status.message = "Unable to find bot in user list";
			return (status);
		}
		const botSessionEntry = Object.entries(this.botSessions).find(([botSessionToken, botId]) => botId === botUser.uuid);
		if (botSessionEntry === undefined) {
			status.message = "Bot Session is not found";
			return (status);
		}
		this.disconnectUser(botUser);
		this.whitelist.splice(this.whitelist.indexOf(botUser.uuid), 1);
		const botSessionToken = botSessionEntry[0];
		delete(this.botSessions[botSessionToken]);
		status.success = true;
		status.message = "Successfully removed bot";
		return (status);
	}

	public update(data: LobbyRequest): boolean {
		const updatedWhitelist = data.playerUuids.concat(Object.values(this.botSessions))
		const kickUuids = this.whitelist.filter((uuid) => updatedWhitelist.indexOf(uuid) === -1);
		this.whitelist = updatedWhitelist;
		for (let i = 0; i < kickUuids.length; i++) {
			const user = this.users.find((user) => user.uuid === kickUuids[i]);
			if (user !== undefined) {
				kickSocket(user.socket, "Lobby is updated and kicked non-whitelisted members");
			}
		}
		this.hostUuid = data.hostUuid;
		console.log(`Lobby<${this.sessionId}> is updated:`, data);
		return (true);
	}

	private initSeats(totalSeats: number, uuid: string): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		}
		if (uuid !== this.hostUuid) {
			status.message = "You are not the host";
			return (status);
		}
		if (totalSeats < 1 || totalSeats > 4) {
			status.message = "Seats are out of bounds";
			return (status);
		}
		for (let i = 0; i < this.users.length; i++) {
			this.users[i].leaveSeat();
		}
		this.availableSeats.length = 0;
		for (let i = 0; i < totalSeats; i++) {
			this.availableSeats.push(i);
		}
		this.totalSeats = totalSeats;
		this.emitSeatOrder();
		status.success = true;
		status.message = "Successfully initialized seats";
		return (status);
	}

	public kickSockets() {
		for (let i = 0; i < this.users.length; i++) {
			kickSocket(this.users[i].socket, "Connected lobby is deleted");
		}
	}
}