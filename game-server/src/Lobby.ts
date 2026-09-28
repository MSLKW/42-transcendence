import { Socket } from 'socket.io';
import { io, kickSocket, LobbyRequest } from './server.js';
import { UserState } from './UserState.js';
import { GameState } from './GameState.js';
import { GameSettingsTransmit, GameStartRequest, SeatOrderTransmit, StatusTransmit } from '@big2/game-types';
import { EventEmitter } from 'node:events';
import { success } from 'zod';
import { privateDecrypt } from 'node:crypto';

export class Lobby {
	private hostUuid: string;
	private users: Array<UserState>;
	private totalSeats: number;
	public	availableSeats: Array<number>;
	private whitelist: Array<string>;
	private totalUsersLimit: number;
	public	lobbyRoomId: string;
	public	game: GameState;
	public	sessionId: string;
	public	events: EventEmitter;

	constructor(data: LobbyRequest, sessionId: string) {
		this.hostUuid = data.hostUuid;
		this.users = [];
		this.whitelist = data.playerUuids;
		this.totalSeats = 4;
		this.availableSeats = [];
		this.totalUsersLimit = 5;
		this.sessionId = sessionId;
		this.events = new EventEmitter();
		this.game = new GameState(this.sessionId);
		this.lobbyRoomId = "lobby" + this.sessionId;
		this.initSeats(4, this.hostUuid);
	}

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
		const userInGame = this.users.find((user) => user.uuid === uuid);
		if (userInGame !== undefined) {
			// kickSocket(userInGame.socket);
			// console.log(`User<${uuid}> old socket is kicked: ${userInGame.socket.id}`);
			// maybe have it reconnect with new socket instead of deleting it
			kickSocket(socket, "User is already in game");
			return ;
		}
		
		const user = new UserState(socket, uuid, this);
		this.users.push(user);
		console.log(`User<${user.uuid}> has connected`);
		this.emitUserList();
		user.socket.emit("user_seat_update", this.getSeatData());

		if (this.game.uuidInGame(user.uuid) === true) {
			this.game.playerReconnect(user);
		}
		else if (this.game.isGameStarted === true) {
			this.game.addSpectator(user);
		}

		user.socket.on("disconnect", () => {
			this.disconnectUser(user);
		});

		user.socket.on("game_start_request", (statusCallback) => {
			statusCallback(this.GameStartRequest(user));
		});

		user.socket.on("user_seat_change", (totalSeats: number, statusCallback) => {
			statusCallback(this.initSeats(totalSeats, user.uuid));
		});

		user.socket.on("game_settings_set", (gameSettings: GameSettingsTransmit) => {
			const status = this.GameSetSettings(user, gameSettings);
			user.socket.emit("game_settings_set", status);
			if (status.success === true) {
				this.emit("game_settings_update", this.game.settings);
			}
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
		console.log(`User<${disconnectedUser.uuid}> disconnected`);
		if (this.isActive() === false) {
			this.events.emit("lobby:inactive");
		}
	}

	private GameStartRequest(user: UserState): StatusTransmit {
		if (this.hostUuid !== user.uuid) {
			const status: StatusTransmit = {
				success: false,
				message: "Not the host"
			}
			return (status);
		}
		const usersToPlay = this.users.filter((user) => user.seat >= 0).sort((userA, userB) => userA.seat - userB.seat);
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

	public isActive() {
		return (this.users.length > 0);
	}

	public update(data: LobbyRequest): boolean {
		const kickUuids = this.whitelist.filter((uuid) => data.playerUuids.indexOf(uuid) === -1);
		this.whitelist = data.playerUuids;
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
}