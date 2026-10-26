import { Server, Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { clientManager } from "./ClientManager";
import { RateLimiter } from "../utils/RateLimiter";
import { PartyManager } from "../party/PartyManager";

/** Socket type used by chat activity handlers */
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/** Server type used to broadcast chat activity */
type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

const maxMessageLength = 500;
const validChatTypes = new Set(["MESSAGE", "EMOTE"]);

const messageLimiter = new RateLimiter({ maxRequests: 5, windowMs: 5000 });
const emoteLimiter = new RateLimiter({ maxRequests: 3, windowMs: 2000 });
const typingLimiter = new RateLimiter({ maxRequests: 20, windowMs: 5000 });

/** Registers typing and message events with their rate limits */
export function registerChatActivityEvents(
	io: ChatServer,
	socket: ChatSocket,
	client: Client,
	partyManager: PartyManager,
): void {
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
		if (!payload || typeof payload.message !== "string" || typeof payload.type !== "string" || !validChatTypes.has(payload.type))
			return;

		const trimmedMessage = payload.message.trim();
		if (!trimmedMessage)
			return;
		if (trimmedMessage.length > maxMessageLength) {
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

/** Clears a user's chat rate limit history */
export function removeRateLimiters(uuid: string): void {
	messageLimiter.remove(uuid);
	emoteLimiter.remove(uuid);
	typingLimiter.remove(uuid);
}