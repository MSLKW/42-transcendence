import { DisconnectReason, Server, Socket } from "socket.io";
import { createServer } from "http";
import { Client } from "./client/Client";
import { clientManager } from "./client/ClientManager";
import { registerEventHandlers, removeRateLimiters } from "./client/event_handlers";
import { ClientToServerEvents, ServerToClientEvents } from "./events";

const PORT = Number(process.env.PORT) || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");
const SOCKET_CHAT_PATH = process.env.SOCKET_CHAT_PATH;
if (!SOCKET_CHAT_PATH)
	throw new Error("SOCKET_CHAT_PATH is not set");

const RECONNECT_GRACE_PERIOD_MS = Number(process.env.DISCONNECT_GRACE_PERIOD_MS) || 15_000;
const PERMANENT_DISCONNECT_REASONS = new Set([
	"server namespace disconnect",
	"client namespace disconnect",
]);
const httpServer = createServer();
// const GAME_ORIGIN = process.env.GAME_ORIGIN;
// if (!GAME_ORIGIN)
	// throw new Error("GAME_ORIGIN is not set");
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
	cors: {
		origin: "*",
		// origin: GAME_ORIGIN,
		// credentials: true
	},
	path: SOCKET_CHAT_PATH, // Socket.io (through engine.io) strips a trailing slash from path and adds one back itself, so "/socket/chat" and "/socket/chat/" behave the same.
}); 

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

io.use(async (socket, next) => {
	const token = getSessionToken(socket);
	if (!token)
		return next(new Error("UNAUTHORIZED: no session token provided"));

	try {
		const response = await fetch(`${AUTH_SERVICE_URL}/validate`, {
			headers: {
				Cookie: socket.handshake.headers.cookie || "",
				Authorization: `Bearer ${token}`
			},
			signal: AbortSignal.timeout(5000)
		});
		if (!response.ok)
			return next(new Error("UNAUTHORIZED: invalid or expired session"));

		const data = await response.json();
		if (typeof data.userId !== "string" || !data.userId) {
			console.error("Auth service returned an OK response with no valid uuid");
			return next(new Error("UNAUTHORIZED: malformed validation response"));
		}
		socket.data.uuid = data.userId;
		next();
	} catch (err) {
		console.error("Auth validation failed for chat:", err);
		return next(new Error("UNAUTHORIZED: could not validate session"));
	}
});

io.on("connection", (socket: ChatSocket) => {
	const uuid = socket.data.uuid;
	if (!uuid) {
		socket.disconnect(true);
		return;
	}

	const existing = clientManager.getByUuid(uuid);
	if (existing) {
		clientManager.cancelRemoval(uuid);

		if (existing.roomId)
			socket.join(existing.roomId);
		registerEventHandlers(io, socket, existing);

		const oldSocket = clientManager.rebindSocket(existing, socket);
		oldSocket.disconnect(true);

		console.log(`User<${uuid}> reconnected on socket<${socket.id}>`);
	} else {
		const client = new Client(socket, uuid, uuid);
		clientManager.add(client);

		socket.join(uuid);
		registerEventHandlers(io, socket, client);
		console.log(`User<${uuid}> connected on socket ${socket.id} in room ${uuid}`);
	}

	socket.on("disconnect", (reason: DisconnectReason) => {
		const client = clientManager.getBySocketId(socket.id);
		if (!client || client.socket.id !== socket.id)
			return ;

		if (PERMANENT_DISCONNECT_REASONS.has(reason)) {
			removeRateLimiters(client.uuid);
			finalizeRemoval(uuid, reason);
			return;
		}
		clientManager.scheduleRemoval(
			uuid,
			RECONNECT_GRACE_PERIOD_MS,
			(client) => {
				removeRateLimiters(client.uuid);
				finalizeRemoval(client.uuid, "reconnection grace period ended");
			}
		);
		console.log(`User<${uuid}> disconnected (${reason}). Waiting ${RECONNECT_GRACE_PERIOD_MS}ms`);
	});
});

function getSessionToken(socket: ChatSocket): string | undefined {
	const cookie = socket.handshake.headers.cookie;
	const sessionToken = cookie
		?.split(";")
		.map(part => part.trim())
		.find(part => part.startsWith("session_token="))
		?.slice("session_token=".length);
	if (sessionToken)
		return sessionToken;

	const authToken = socket.handshake.auth?.token;
	return typeof authToken === "string"
		? authToken
		: undefined;
}

function finalizeRemoval(uuid: string, reason: string): void {
	const client = clientManager.removeByUuid(uuid);
	if (!client)
		return;

	if (client.roomId) {
		io.to(client.roomId).emit("chat_user_left", {
			senderUuid: uuid,
			timestamp: new Date().toISOString()
		});
	}

	console.log(`User<${uuid}> disconnected - ${reason}`);
}

httpServer.listen(PORT, () => {
	console.log(`Chat Socket.IO server listening on port ${PORT}`);
});

// TODO (signal handler): uncomment this when need to implement the signal handler
// // Graceful shutdown on Ctrl+C / `docker compose down` & `docker compose stop` (both stop containers the same way). 
// // Stop taking new requests, close the DB
// // pool cleanly, then exit, well inside Docker's 10s SIGKILL deadline.
// function shutdown() {
//   server.close();					// 1. stop accepting new work
//   									// 2. service-specific cleanup
//   									// 3. close DB pool (DB services only, this chat service no need)
//   process.exit(0);					// 4. end the process, exit code 0 = clean shutdown
// }
// process.on('SIGINT', shutdown);		// Ctrl+C
// process.on('SIGTERM', shutdown);	// `docker compose down` & `docker compose stop` (both stop containers the same way)
