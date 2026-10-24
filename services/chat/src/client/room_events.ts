import { Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { PartyManager } from "../party/PartyManager";

//socket type used by room event handlers
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

//registers room join and leave behavior
export function registerRoomEvents(socket: ChatSocket, client: Client, partyManager: PartyManager): void {
	socket.on("chat_join_room", (payload) => {
		if (!payload || typeof payload.roomId !== "string")
			return;

		const requestedRoomId = payload.roomId.trim();
		if (!requestedRoomId)
			return;

		const isOwnSoloRoom = requestedRoomId === client.uuid;
		const isWhitelistedPartyRoom = partyManager.isPlayerWhitelisted(requestedRoomId, client.uuid);
		if (!isOwnSoloRoom && !isWhitelistedPartyRoom) {
			console.warn(`User<${client.uuid}> attempted to join unauthorized chat room<${requestedRoomId}>`);
			return;
		}

		const expectedRoom = partyManager.getRoomForPlayer(client.uuid);
		if (requestedRoomId !== expectedRoom) {
			console.warn(`User<${client.uuid}> attempted to join room ${requestedRoomId}, expected ${expectedRoom}`);
			return;
		}
		if (client.roomId === requestedRoomId) {
			if (!socket.rooms.has(requestedRoomId))
				socket.join(requestedRoomId);
			return;
		}

		const previousRoomId = client.roomId;
		socket.leave(previousRoomId);
		socket.to(previousRoomId).emit("chat_user_left", {
			senderUuid: client.uuid,
			timestamp: new Date().toISOString(),
		});

		client.roomId = requestedRoomId;
		socket.join(requestedRoomId);
		socket.to(requestedRoomId).emit("chat_user_joined", {
			senderUuid: client.uuid,
			timestamp: new Date().toISOString(),
		});
		console.log(`User<${client.uuid}> joined chat room: ${requestedRoomId}`);
	});
}
