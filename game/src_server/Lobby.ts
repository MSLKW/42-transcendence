import { Socket } from 'socket.io';
import { io, kickSocket, LobbyRequest } from './server.js';
import { UserState } from './UserState.js';
import { GameState } from './GameState.js';
import { GameStartRequest, SeatOrderTransmit, StatusTransmit } from '../src_shared/Types.js';
import { EventEmitter } from 'node:events';
import { success } from 'zod';

export class Lobby {
	private hostUuid: string;
	private users: Array<UserState>;
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

	public getSeatOrder() {
		const seatOrder: Record<string, number> = {};
		for (let i = 0; i < this.users.length; i++) {
			const seat = this.users[i].seat;
			if (seat >= 0) {
				seatOrder[this.users[i].uuid] = seat;
			}
		}
		return (seatOrder);
	}

	public emitSeatOrder() {
		const seatOrder: SeatOrderTransmit = {
			seatOrder: this.getSeatOrder()
		}
		this.emit("user_seat_update", seatOrder);
	}

	public emitUserList() {
		const userUuidList: Array<string> = [];
		for (let i = 0; i < this.users.length; i++) {
			userUuidList.push(this.users[i].uuid);
		}
		this.emit("user_list_update", userUuidList);
	}

	public connectUser(socket: Socket, uuid: string) {
		const index = this.users.findIndex((user) => user.uuid === uuid);
		if (this.whitelist.indexOf(uuid) === -1 || 
			index >= 0 ||
			this.users.length >= this.totalUsersLimit || 
			(this.game.uuidInGame(uuid) === false && this.users.length >= this.totalUsersLimit - this.game.getDisconnectedPlayers())) {
			kickSocket(socket);
			console.log(`User<${uuid}> is not allowed to connect`);
			return ;
		}
		
		const user = new UserState(socket, uuid, this);
		this.users.push(user);
		console.log(`User<${user.uuid}> has connected`);
		this.emitUserList();

		if (this.game.uuidInGame(user.uuid) === true) {
			this.game.playerReconnect(user);
		}
		else if (this.game.isGameStarted === true) {
			this.game.addSpectator(user);
		}

		user.socket.on("disconnect", () => {
			this.disconnectUser(user);
		});

		user.socket.on("game_start_request", (gameStartRequest: GameStartRequest) => {
			this.GameStartRequest(user, gameStartRequest);
		});

		user.socket.on("user_seat_change", (totalSeats: number) => {
			const status = this.initSeats(totalSeats, user.uuid);
			user.socket.emit("user_seat_change", status);
		})
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

	private GameStartRequest(user: UserState, gameStartRequest: GameStartRequest) {
		if (this.hostUuid !== user.uuid) {
			const status: StatusTransmit = {
				success: false,
				message: "Not the host"
			}
			user.socket.emit("game_start_request", status);
			return ;
		}
		const usersToPlay = this.users.filter((user) => user.seat >= 0).sort((userA, userB) => userA.seat - userB.seat);
		for (let i = 0; i < usersToPlay.length; i++) {
			this.game.addPlayer(usersToPlay[i]);
		}
		const userSpectators = this.users.filter((user) => user.seat === -1);
		for (let i = 0; i < userSpectators.length; i++) {
			this.game.addSpectator(userSpectators[i]);
		}
		user.socket.emit("game_start_request", this.game.startGame());
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
				kickSocket(user.socket);
			}
		}
		// this.hostUuid = data.hostUuid;
		console.log(`lobby${this.sessionId} is updated`)
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
		this.emitSeatOrder();
		this.availableSeats.length = 0;
		for (let i = 0; i < totalSeats; i++) {
			this.availableSeats.push(i);
		}
		status.success = true;
		status.message = "Successfully initialized seats";
		return (status);
	}
}