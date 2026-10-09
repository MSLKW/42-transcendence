import { DisconnectReason, Server, Socket } from "socket.io";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Client } from "./client/Client";
import { clientManager } from "./client/ClientManager";
import { registerEventHandlers, removeRateLimiters } from "./client/event_handlers";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import {
	PartyManager,
	PartyNotFoundError,
	PartyConflictError,
	ValidationError,
	PartyPayload
} from "./party/PartyManager";

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
const httpServer = createServer(
	async (req, res) => {
		await handleHttpRequest(req, res);
	}
);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
	cors: {
		origin: "*",
	},
	path: SOCKET_CHAT_PATH, // Socket.io (through engine.io) strips a trailing slash from path and adds one back itself, so "/socket/chat" and "/socket/chat/" behave the same.
});
const partyManager = new PartyManager(io);

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

		const expectedRoom = partyManager.getRoomForPlayer(uuid);
		if (existing.roomId !== expectedRoom)
			existing.roomId = expectedRoom;

		socket.join(existing.roomId);

		registerEventHandlers(io, socket, existing, partyManager);

		const oldSocket = clientManager.rebindSocket(existing, socket);
		oldSocket.disconnect(true);

		console.log(`User<${uuid}> reconnected on socket<${socket.id}> in room ${existing.roomId}`);
	} else {
		const roomId = partyManager.getRoomForPlayer(uuid);
		const client = new Client(socket, uuid, roomId);
		clientManager.add(client);

		socket.join(roomId);

		registerEventHandlers(io, socket, client, partyManager);

		console.log(`User<${uuid}> connected on socket ${socket.id} in room ${roomId}`);
	}

	socket.on("disconnect", (reason: DisconnectReason) => {
		const client = clientManager.getBySocketId(socket.id);
		if (!client || client.socket.id !== socket.id)
			return ;

		if (PERMANENT_DISCONNECT_REASONS.has(reason)) {
			removeRateLimiters(client.uuid);
			finalizeRemoval(client.uuid, reason);
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
		.map((part) => part.trim())
		.find((part) => part.startsWith("session_token="))
		?.slice("session_token=".length);
	if (sessionToken)
		return sessionToken;

	const authToken = socket.handshake.auth?.token;
	return typeof authToken === "string" ? authToken : undefined;
}

function finalizeRemoval(uuid: string, reason: string): void {
	const client = clientManager.removeByUuid(uuid);
	if (!client)
		return;

	io.to(client.roomId).emit("chat_user_left", {
		senderUuid: uuid,
		timestamp: new Date().toISOString()
	});

	console.log(`User<${uuid}> disconnected - ${reason}`);
}

async function handleHttpRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
	try {
		const method = req.method || "GET";
		const url = new URL(
			req.url || "/",
			"http://localhost"
		);

		if (method === "GET" && url.pathname === "/health") {
			res.statusCode = 204;
			res.end();
			return;
		}

		if (method === "POST" && url.pathname === "/party") {
			const body = await readJsonBody(req);
			const payload = validatePartyPayload(body);
			partyManager.createParty(payload);
			sendJson(
				res,
				201,
				{
					hostUuid: payload.hostUuid,
					playerUuids: payload.playerUuids,
				},
			)
			return;
		}

		if (method === "PUT" && url.pathname.startsWith("/party/")) {
			const currentHostUuid = decodeURIComponent(url.pathname.slice("/party/".length));
			if (!currentHostUuid) {
				sendJson(
					res,
					400,
					{ error: "hostUuid is required" }
				);
				return;
			}

			const body = await readJsonBody(req);
			const payload = validatePartyPayload(body);
			partyManager.updateParty(currentHostUuid, payload);

			res.statusCode = 204;
			res.end();
			return;
		}

		if (method === "DELETE" && url.pathname.startsWith("/party/")) {
			const hostUuid = decodeURIComponent(url.pathname.slice("/party/".length));
			if (!hostUuid) {
				sendJson(
					res,
					400,
					{ error: "hostUuid is required" }
				);
				return;
			}

			partyManager.deleteParty(hostUuid);

			res.statusCode = 204;
			res.end();
			return;
		}

		sendJson(
			res,
			404,
			{ error: "Not found" }
		);
	} catch (error) {
		handleHttpError(res, error);
	}
}

function validatePartyPayload(body: unknown): PartyPayload {
	if (!body || typeof body !== "object")
		throw new ValidationError("Request body must be an object");

	const value = body as Record<string, unknown>;
	if (typeof value.hostUuid !== "string")
		throw new ValidationError("hostUuid must be a string");
	if (!Array.isArray(value.playerUuids))
		throw new ValidationError("playerUuids must be an array");

	return {
		hostUuid: value.hostUuid,
		playerUuids: value.playerUuids as string[],
	}
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
	const chunks: Buffer[] = [];
	let size = 0;
	const MAX_BODY_SIZE = 1024 * 1024;

	for await (const chunk of req) {
		const buffer = Buffer.from(chunk);
		size += buffer.length;
		if (size > MAX_BODY_SIZE)
			throw new ValidationError("Request body is too large");

		chunks.push(buffer);
	}

	if (size === 0)
		throw new ValidationError("Request body is required");

	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new ValidationError("Request body must contain valid JSON");
	}
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
	res.statusCode = statusCode;
	res.setHeader(
		"Content-Type",
		"application/json"
	);
	res.end(JSON.stringify(body));
}

function handleHttpError(res: ServerResponse, error: unknown): void {
	if (error instanceof ValidationError) {
		sendJson(
			res,
			400,
			{ error: error.message }
		)
		return;
	}

	if (error instanceof PartyNotFoundError) {
		sendJson(
			res,
			404,
			{ error: error.message }
		)
		return;
	}

	if (error instanceof PartyConflictError) {
		sendJson(
			res,
			409,
			{ error: error.message }
		)
		return;
	}

	console.error("Unhandled HTTP error:", error);
	sendJson(
		res,
		500,
		{ error: "Internal server error" }
	)
}

httpServer.listen(PORT, () => {
	console.log(`Chat Socket.IO server listening on port ${PORT}`);
});