import { Socket } from 'socket.io';
import { check } from 'zod';
import { Lobby } from './Lobby.js';
import { statusTransmit } from '../src_shared/Types.js';

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
			const status = this.userTakeSeat(wantedSeat);
			this.socket.emit("user_seat_take", status);
			if (status.success === true) {
				this.lobbyRef.emitSeatOrder();
			}
		});

		this.socket.on("user_seat_leave", () => {
			const status = this.userLeaveSeat();
			this.socket.emit("user_seat_leave", status);
			if (status.success === true) {
				this.lobbyRef.emitSeatOrder();
			}
		});
	}

	private userTakeSeat(selectedSeat: number): statusTransmit {
		const status: statusTransmit = {
			success: false,
			message: ""
		};
		const seatIndex = this.lobbyRef.availableSeats.indexOf(selectedSeat);
		if (seatIndex === -1) {
			status.message = "Selected seat could not be found";
			return (status);
		}
		this.seat = this.lobbyRef.availableSeats[seatIndex];
		this.lobbyRef.availableSeats.splice(seatIndex, 1);
		status.success = true;
		status.message = "Player successfully took a seat";
		return (status);
	}

	private userLeaveSeat(): statusTransmit {
		const status: statusTransmit = {
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