import { Socket } from 'socket.io';
import { io, kickSocket } from './server.js';
import { UserState } from './UserState.js';
import { GameState } from './GameState.js';
import { GameStartRequest, SeatOrderTransmit, StatusTransmit } from '../src_shared/Types.js';

export class Lobby {
	private hostUUID: string;
	private users: Array<UserState>;
	public	availableSeats: Array<number>;
	private whitelist: Array<string>;
	private totalUsersLimit: number;
	public	lobbyRoomId: string;
	public	game: GameState;

	constructor(hostUUID: string, whitelist: Array<string>, playersLimit: number, sessionId: string) {
		this.hostUUID = hostUUID;
		this.users = [];
		this.whitelist = whitelist;
		this.availableSeats = [];
		this.totalUsersLimit = 8;
		this.game = new GameState(playersLimit, sessionId);
		this.lobbyRoomId = "lobby" + sessionId;
		for (let i = 0; i < playersLimit; i++) {
			this.availableSeats.push(i);
		}
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

	public connectUser(socket: Socket, uuid: string) {
		const newUser = new UserState(socket, uuid, this);
		newUser.socket.on("disconnect", () => {
			this.disconnectUser(newUser);
		});

		newUser.socket.on("game_start_request", (gameStartRequest: GameStartRequest) => {
			if (this.hostUUID !== newUser.uuid) {
				const status: StatusTransmit = {
					success: false,
					message: "Not the host"
				}
				newUser.socket.emit("game_start_request", status);
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
			newUser.socket.emit("game_start_request", this.game.startGame());
		});

		const index = this.users.findIndex((user) => user.uuid === newUser.uuid);
		if (index === -1 && this.users.length < this.totalUsersLimit && this.whitelist.indexOf(newUser.uuid) >= 0) {
			this.connectNewUser(newUser);
		}
		else if (index >= 0) {
			// reconnecting user to lobby
			const reconnectedUser = this.users[index];
			reconnectedUser.socket = newUser.socket;
			console.log(`User<${reconnectedUser.uuid}> has reconnected`);
			this.game.playerReconnect(reconnectedUser);
		}
		else {
			kickSocket(newUser.socket);
			console.log(`User<${newUser.uuid}> is not allowed to connect`);
		}
	}

	private connectNewUser(user: UserState) {
		this.users.push(user);
		console.log(`User<${user.uuid}> has connected`);
		this.emit("user_connect", user.uuid);
	}

	private disconnectUser(disconnectedUser: UserState) {
		const index = this.users.findIndex((user) => user.uuid === disconnectedUser.uuid);
		if (index >= 0) {
			if (this.game.isGameStarted === true && this.game.userInGame(disconnectedUser)) {
				this.game.playerDisconnect(disconnectedUser);
			}
			else {
				this.users[index].leaveSeat();
				this.emit("user_disconnect", this.users[index].uuid);
				this.users.splice(index, 1);
				console.log(`User<${disconnectedUser.uuid}> fully disconnected`);
			}
		}
		else {
			console.log(`Disconnecting user is not found in users`);
		}
	}
}