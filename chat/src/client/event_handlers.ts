import { Socket, Server } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { clientManager } from "./ClientManager";
import { RateLimiter } from "../RateLimiter";
import { PartyManager } from "../party/PartyManager";

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const MAX_MESSAGE_LENGTH = 500;

const messageLimiter= new RateLimiter({
	maxRequests: 5,
	windowMs: 5000,
});

const emoteLimiter = new RateLimiter({
	maxRequests: 3,
	windowMs: 2000,
});

const typingLimiter = new RateLimiter({
	maxRequests: 20,
	windowMs: 5000,
});

const VALID_CHAT_TYPE = new Set([
	"MESSAGE",
	"EMOTE"
]);

export function registerEventHandlers(
	io: Server<ClientToServerEvents, ServerToClientEvents>,
	socket: ChatSocket,
	client: Client,
	partyManager: PartyManager
): void {
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
			timestamp: new Date().toISOString()
		});

		console.log(`User<${client.uuid}> joined chat room: ${requestedRoomId}`);
	});

	socket.on("chat_typing", (payload) => {
		if (!payload || typeof payload.isTyping !== "boolean")
			return;

		const currentClient = clientManager.getBySocketId(socket.id);
		if (!currentClient || currentClient !== client)
			return;

		const roomId = client.roomId;
		if (!roomId || !socket.rooms.has(roomId)) {
			console.warn(`User<${client.uuid}> is not correctly joined to room ${roomId}`);
			return;
		}

		if (!typingLimiter.allow(client.uuid))
			return;

		socket.to(roomId).emit("chat_user_typing", {
			senderUuid: client.uuid,
			isTyping: payload.isTyping,
		});
	});

	socket.on("chat_message", (payload) => {
		if (!payload || typeof payload.message !== "string" || typeof payload.type !== "string" || !VALID_CHAT_TYPE.has(payload.type))
			return;

		const trimmedMessage = payload.message.trim();
		if (!trimmedMessage)
			return;
		if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
			console.warn(`User<${client.uuid}> sent oversized message`);
			return;
		}

		const roomId = client.roomId;
		if (!roomId || !socket.rooms.has(roomId)) {
			console.warn(`User<${client.uuid}> tried to chat without being in their assigned room`);
			return;
		}

		const expectedRoom = partyManager.getRoomForPlayer(client.uuid);
		if (roomId !== expectedRoom) {
			console.warn(`User<${client.uuid}> room mismatch: actual=${roomId}, expected=${expectedRoom}`);
			return;
		}

		const limiter = payload.type === "EMOTE" ? emoteLimiter : messageLimiter;

		if (!limiter.allow(client.uuid)) {
			console.warn(`User<${client.uuid}> exceeded ${payload.type} rate limit`);
			socket.emit("chat_rate_limited", {
				type: payload.type,
				message: "Rate limited - too many messages sent",
			});
			return;
		}

		const msgPayload = {
			senderUuid: client.uuid,
			type: payload.type,
			message: trimmedMessage,
			timestamp: new Date().toISOString(),
		};
		io.to(roomId).emit("chat_message", msgPayload);
		
		console.log(`<chat_message> roomId:${client.roomId} senderUuid:${msgPayload.senderUuid} type:${msgPayload.type} message:${msgPayload.message} timestamp:${msgPayload.timestamp}`);
	});
}

export function removeRateLimiters(
	uuid: string
): void {
	messageLimiter.remove(uuid);
	emoteLimiter.remove(uuid);
	typingLimiter.remove(uuid);
}