import { Socket } from "socket.io";
import { Client } from "./Client";
import { Party } from "../party/Party";
import { clientManager } from "./ClientManager";

export function registerEventHandlers(socket: Socket, client: Client)
{
	socket.on("send_invite", (payload: {recipientUuid: string}, callback) =>
	{
		if (client.party != null && client.party.hostId != client.uuid)
			return callback({ success: false, reason: "you are not the host" });
		if (client.uuid == payload.recipientUuid)
			return callback({ success: false, reason: "cannot invite yourself" });
		
		const recipient = clientManager.getByUuid(payload.recipientUuid);
		if (!recipient)
			return callback({ success: false, reason: "user is offline" });
		if (client.party == null)
			client.party = new Party(client);
		client.party.addInvite(recipient);
		recipient.emit("invite_received", {hostUuid: client.uuid});
		return callback({ success: true });
	});

	socket.on("kick_player", (payload: {recipientUuid: string}) =>
	{
		const recipient = clientManager.getByUuid(payload.recipientUuid);
		
		if (!recipient || recipient.party.hostId != client.uuid)
			return ;
		const party = recipient.party;

		party.removeUser(payload.recipientUuid);
		recipient.emit("kicked", { message: "you were kicked by the host" });
		recipient.emitState();
	});

	socket.on("accept_invite", (payload: {hostUuid: string}, callback) =>
	{
		const party = clientManager.getByUuid(payload.hostUuid)?.party;
		if (!party)
			return (callback({success: false, reason: "party is invalid or no longer exists"}));
		if (!party.addUser(client.uuid))
			return (callback({success: false, reason: "you are not invited to this party"}));
		return (callback({success: true}));
	});

	socket.on("reject_invite", (payload: {hostUuid: string}) =>
	{
		const party = clientManager.getByUuid(payload.hostUuid)?.party;
		party?.removeInvite(client.uuid);
	});

	socket.on("leave_party", () =>
	{
		const party = client.party;
		
		party.removeUser(client.uuid);
		client.emitState();
	});

	socket.on("start_game_session", () =>
	{
		if (client.party == null)
			client.party = new Party(client);
		else if (client.party.hostId != client.uuid || client.party.gameId != null)
			return ;
		client.party.startGameSession();
	});

	socket.on("refresh", () =>
	{
		if (!client.party)
			return ;
		client.party.sendUpdates();
	});
}