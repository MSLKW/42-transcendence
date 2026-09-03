import { Socket } from "socket.io";
import { Client } from "./Client";
import { Party } from "../party/Party";
import { clientManager } from "./ClientManager";

export function registerEventHandlers(socket: Socket, client: Client)
{
	socket.on("send_invite", (payload: {recipientUuid: string}) =>
	{
		if (client.party != null && client.party.hostId != client.uuid)
			return ;
		if (client.uuid == payload.recipientUuid)
			return ;
		
		const recipient = clientManager.getByUuid(payload.recipientUuid);
		if (!recipient)
			return ;
		if (client.party == null)
			client.party = new Party(client);
		client.party.addInvite(recipient);
		recipient.emit("invite_received", {hostUuid: client.uuid});
	});

	socket.on("kick_player", (payload: {recipientUuid: string}) =>
	{
		const recipient = clientManager.getByUuid(payload.recipientUuid);
		
		if (!recipient || !recipient.party || recipient.party.hostId != client.uuid)
			return ;
		recipient.party.removeUser(payload.recipientUuid);
		recipient.emit("kicked", {message: "you were kicked by the host"});
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
		client.party?.removeUser(client.uuid);
	});

	socket.on("start_game_session", () =>
	{
		if (client.party == null)
			client.party = new Party(client);
		else if (client.party.gameId != null)
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