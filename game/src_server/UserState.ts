import { Socket } from 'socket.io';
import { check } from 'zod';
import { Lobby } from './Lobby.js';
import { StatusTransmit } from '../src_shared/Types.js';

export class UserState {
	public	socket: Socket;
	public	uuid: string;
	public	seat: number;
	public	lobbyRef: Lobby;

	constructor(socket: Socket, lobbyRef: Lobby) {
		this.socket = socket;
		this.lobbyRef = lobbyRef;
		const authId = this.socket.handshake.auth.token;
		this.uuid = this.getUUID(authId);
		this.seat = -1;

		this.socket.on("user_seat_take", (wantedSeat: number) => {
			const status = this.takeSeat(wantedSeat);
			this.socket.emit("user_seat_take", status);
			if (status.success === true) {
				this.lobbyRef.emitSeatOrder();
			}
		});

		this.socket.on("user_seat_leave", () => {
			const status = this.leaveSeat();
			this.socket.emit("user_seat_leave", status);
			if (status.success === true) {
				this.lobbyRef.emitSeatOrder();
			}
		});

		this.socket.on("user_spectate", () => {
			if (this.lobbyRef.game.isGameStarted === true) {
				this.lobbyRef.game.addSpectator(this);
			}
		})
	}

	private takeSeat(selectedSeat: number): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		};
		const seatIndex = this.lobbyRef.availableSeats.indexOf(selectedSeat);
		if (seatIndex === -1) {
			status.message = "Selected seat could not be found";
			return (status);
		}
		if (this.seat >= 0) {
			this.lobbyRef.availableSeats.push(this.seat);
		}
		this.seat = this.lobbyRef.availableSeats[seatIndex];
		this.lobbyRef.availableSeats.splice(seatIndex, 1);
		status.success = true;
		status.message = "Player successfully took a seat";
		return (status);
	}

	public leaveSeat(): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		};
		if (this.seat === -1) {
			status.message = "User does not have a seat";
			return (status);
		}
		this.lobbyRef.availableSeats.push(this.seat);
		this.seat = -1;
		status.success = true;
		status.message = "User successfully left the seat";
		return (status);
	}

	private getUUID(authId: string): string {
		// Get associated player uuid from checking with authentication service
		// if auth service doesn't return player uuid, means that the player is not authenticated, raise some error
		return (authId);
	}
}