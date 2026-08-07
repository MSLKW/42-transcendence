import { Socket } from 'socket.io';
import { check } from 'zod';
import { Lobby } from './Lobby.js';
import { StatusTransmit } from '@bigtwo/shared';
import { kickSocket } from './server.js';

export class UserState {
	public	socket: Socket;
	public	uuid: string;
	public	seat: number;
	public	lobbyRef: Lobby;
	private inactivityTimeout: NodeJS.Timeout;

	constructor(socket: Socket, uuid: string, lobbyRef: Lobby) {
		this.socket = socket;
		this.lobbyRef = lobbyRef;
		this.uuid = uuid;
		this.seat = -1;
		this.socket.join(this.lobbyRef.lobbyRoomId);
		this.inactivityTimeout = setTimeout(() => {
			kickSocket(this.socket);
			console.log(`Inactivity timed out User<${this.uuid}>`);
		}, 10 * 60 * 1000);

		socket.onAny(() => {
			this.inactivityTimeout.refresh();
		});

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
}