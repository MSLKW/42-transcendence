import { Socket } from "socket.io";
import { Client } from "./Client";
import { Party } from "../party/Party";
import { clientManager } from "./ClientManager";

export function registerEventHandlers(socket: Socket, client: Client)
{
	socket.on("send_invite", (recipientUuid: string) =>
	{
		if (client.party != null && client.party.hostId != client.uuid)
			return ;
		
		const recipient = clientManager.getByUuid(recipientUuid);
		if (!recipient)
			return ;
		if (client.party == null)
			client.party = new Party(client);
		client.party.addInvite(recipient);
		recipient.emit("invite_received", client.uuid);
	});

	socket.on("kick_player", (recipientUuid: string) =>
	{
		if (!client.party || client.party.hostId != client.uuid)
			return ;

		const recipient = clientManager.getByUuid(recipientUuid);
		if (!recipient)
			return ;
		client.party.removeUser(recipientUuid);
		recipient.emit("kicked", "You were kicked by the host");
	});

	socket.on("accept_invite", (payload: {hostUuid: string}, callback) =>
	{
		const party = clientManager.getByUuid(payload.hostUuid)?.party;
		if (!party || party.addUser(client.uuid))
			return (callback({success: false, members: []}));
		else
			return (callback({success: true, members: party.getMemberUuids()}));
	});

	socket.on("reject_invite", (hostUuid: string) =>
	{
		const party = clientManager.getByUuid(hostUuid)?.party;
		party?.removeInvite(client.uuid);
	});

	socket.on("leave_party", () =>
	{
		client.party?.removeUser(client.uuid);
	});
}