import { Socket } from 'socket.io';
import { io } from './server.js';
import { UserState } from './UserState.js';
import { GameState } from './GameState.js';
import { GameStartRequest, SeatOrderTransmit } from '../src_shared/Types.js';

export class Lobby {
	private users: Array<UserState>;
	public	availableSeats: Array<number>;
	// private hostUUID: string;
	// private whitelist: Array<string>;
	private playersInGameLimit: number;
	private totalUsersLimit: number;
	private game: GameState;

	constructor() {
		this.users = [];
		// this.whitelist = [];
		this.availableSeats = [];
		this.playersInGameLimit = 4;
		this.totalUsersLimit = 8;
		this.game = new GameState();
		for (let i = 0; i < this.playersInGameLimit; i++) {
			this.availableSeats.push(i);
		}

		io.on("connection", (socket) => {
			this.connectUser(socket);
		});
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
		for (let i = 0; i < this.users.length; i++) {
			this.users[i].socket.emit("user_seat_update", seatOrder);
		}
	}

	private connectUser(socket: Socket) {
		const newUser = new UserState(socket, this);
		newUser.socket.on("disconnect", () => {
			this.disconnectUser(newUser);
		});

		newUser.socket.on("game_start_request", (gameStartRequest: GameStartRequest) => {
			// check host
			const usersToPlay = this.users.filter((user) => user.seat >= 0).sort((userA, userB) => userA.seat - userB.seat);
			newUser.socket.emit("game_start_request", this.game.startGame(usersToPlay));
		});

		const index = this.users.findIndex((user) => user.uuid === newUser.uuid);
		if (index === -1 && this.users.length < this.totalUsersLimit) {
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
			this.kickUser(newUser);
		}
	}

	private connectNewUser(user: UserState) {
		this.users.push(user);
		console.log(`User<${user.uuid}> has connected`);
		// announce new user joined to other users via socket emit
	}

	private disconnectUser(disconnectedUser: UserState) {
		const index = this.users.findIndex((user) => user.uuid === disconnectedUser.uuid);
		if (index >= 0) {
			if (this.users[index].seat >= 0) {
				this.game.playerDisconnect(disconnectedUser);
			}
			else {
				this.users.splice(index, 1);
				console.log(`User<${disconnectedUser.uuid}> fully disconnected`);
			}
		}
		else {
			console.log(`Disconnecting user is not found in users`);
		}
	}

	private kickUser(user: UserState) {
		user.socket.emit("graceful_disconnect");
		setTimeout(() => {
			user.socket.disconnect(true);
		}, 1000);
		user.socket.removeAllListeners();
		console.log(`Player<${user.uuid}> is not allowed to connect`);
	}
}