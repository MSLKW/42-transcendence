import { io, Socket } from "socket.io-client";
import { acceptInviteAction } from "./actions/acceptInviteAction";
import { kickPlayerAction } from "./actions/kickPlayerAction";
import { leavePartyAction } from "./actions/leavePartyAction";
import { rejectInviteAction } from "./actions/rejectInviteAction";
import { sendInviteAction } from "./actions/sendInviteAction";
import { startGameSessionAction } from "./actions/startGameSessionAction";
import { refreshAction } from "./actions/refreshAction";
import { registerConnectionHandlers } from "./handlers/connectionHandlers";
import { inviteReceivedHandler } from "./handlers/inviteReceivedHandler";
import { kickedHandler } from "./handlers/kickedHandler";
import { partyStateHandler } from "./handlers/partyStateHandler";
import { playerLeftHandler } from "./handlers/playerLeftHandler";
import { playerJoinedHandler } from "./handlers/playerJoinedHandler";

export type SendInviteResponse = {
	success: boolean;
	reason?: string;
}

export type AcceptInviteResponse = {
	success: boolean;
	reason?: string;
}

class PartySocketService {
	private socket: Socket | null = null;

	public connect() {
		if (this.socket)
			return;

		this.socket = io({
			path: "/socket/party",
			transports: ["websocket", "polling"],
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
		});

		registerConnectionHandlers(this.socket);
		partyStateHandler(this.socket);
		inviteReceivedHandler(this.socket);
		kickedHandler(this.socket);
		playerJoinedHandler(this.socket);
		playerLeftHandler(this.socket);
	}

	public disconnect() {
		if (!this.socket)
			return;

		this.socket.disconnect();
		this.socket = null;
	}

	public sendInvite(recipientUuid: string, recipientName?: string) {
		sendInviteAction(this.socket, recipientUuid, recipientName);
	}
	public kickPlayer(recipientUuid: string) {
		kickPlayerAction(this.socket, recipientUuid);
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
		console.log("[partySocket] 'isConnected' ", this.socket?.connected, " id:", this.socket?.id);
		return this.socket?.connected === true;
	}
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		partySocket.disconnect();
	});
}

export const partySocket = new PartySocketService();