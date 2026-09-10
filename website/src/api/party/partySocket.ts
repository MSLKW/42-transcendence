import { io, Socket } from "socket.io-client";
import { acceptInviteAction } from "./actions/acceptInviteAction";
import { kickPlayerAction } from "./actions/kickPlayerAction";
import { leavePartyAction } from "./actions/leavePartyAction";
import { rejectInviteAction } from "./actions/rejectInviteAction";
import { sendInviteAction } from "./actions/sendInviteAction";
import { startGameSessionAction } from "./actions/startGameSessionAction";
import { refreshAction } from "./actions/refreshAction";
import { registerConnectionHandlers } from "./handlers/connectionHandlers";
import { gameSessionStartHandler } from "./handlers/gameSessionStartHandler";
import { inviteReceivedHandler } from "./handlers/inviteReceivedHandler";
import { kickedHandler } from "./handlers/kickedHandler";
import { partyStateHandler } from "./handlers/partyStateHandler";

class PartySocketService {
	private socket: Socket | null = null;
	private isConnecting: boolean = false;

	public connect() {
		if (this.socket?.connected || this.isConnecting)
			return;
		this.isConnecting = true;

		this.socket = io({
			path: "/socket/party",
			transports: ["websocket", "polling"],
		});
		
		registerConnectionHandlers(this.socket, (value) => { this.isConnecting = value });
		partyStateHandler(this.socket);
		inviteReceivedHandler(this.socket);
		kickedHandler(this.socket);
		gameSessionStartHandler(this.socket);
	}
	public disconnect() {
		this.isConnecting = false;
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}
	
	public sendInvite(recipientUuid: string, recipientName?: string) {
		sendInviteAction(this.socket, recipientUuid, recipientName);
	}
	public kickPlayer(recipientUuid: string, recipientName?: string) {
		kickPlayerAction(this.socket, recipientUuid, recipientName);
	}
	public startGameSession() {
		startGameSessionAction(this.socket);
	}
	public acceptInvite(hostUuid: string) {
		acceptInviteAction(this.socket, hostUuid);
	}
	public rejectInvite(hostUuid: string) {
		rejectInviteAction(this.socket, hostUuid);
	}
	public leaveParty() {
		leavePartyAction(this.socket);
	}
	public refresh() {
		refreshAction(this.socket);
	}
	public isConnected(): boolean {
		console.log("[partySocket] 'isConnected' ", this.socket?.connected, " id:", this.socket?.id, " isConnecting:", this.isConnecting);
		return this.socket?.connected === true;
	}
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		partySocket.disconnect();
	});
}

export const partySocket = new PartySocketService();