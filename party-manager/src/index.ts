import "dotenv/config";
import express from "express"
import { healthCheck } from "./handlers/healthCheck"
import { createServer } from "http";
import { DisconnectReason, Server, Socket } from "socket.io";
import { Client } from "./client/Client";
import { clientManager } from "./client/ClientManager";
import { registerEventHandlers } from "./client/event_handlers";

import { PartyState } from "./PartyTransmitTypes";

const PORT = Number(process.env.PORT) || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const RECONNECT_GRACE_PERIOD_MS = Number(process.env.DISCONNECT_GRACE_PERIOD_MS) || 15_000;

if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");

const INTENTIONAL_DISCONNECT_REASONS = new Set([
	"server namespace disconnect", // kicked
	"client namespace disconnect", // client intentionally disconnected
	"forced close",
	"parse error",
	"forced server close",
]);

const pendingRemovals = new Map<string, NodeJS.Timeout>();

const app = express();
app.use(express.json());
app.get("/health", healthCheck());

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "*", // TODO: restrict to actual frontend origin before prod
	},
});

io.use(async (socket, next) => {
	const sessionToken = socket.handshake.headers.cookie
		?.split("; ")
		.find(c => c.startsWith("session_token="))
		?.split("=")[1];	
	const token = sessionToken || socket.handshake.auth?.token;

	if (!token || typeof token !== "string")
		return next(new Error("UNAUTHORIZED: no session token provided"));

	try
	{
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

		if (!data.userId || typeof data.userId !== "string")
		{
			console.error("Auth service returned an OK response with no valid uuid");
			return next(new Error("UNAUTHORIZED: malformed validation response"));
		}

		socket.data.uuid = data.userId;
		next();
	}
	catch (err)
	{
		console.error("Auth validation failed:", err);
		return next(new Error("UNAUTHORIZED: could not validate session"));
	}
});

io.on("connection", (socket: Socket) =>
{
	const uuid = socket.data.uuid;
	
	const pendingTimer = pendingRemovals.get(uuid);
	if (pendingTimer)
	{
		clearTimeout(pendingTimer);
		pendingRemovals.delete(uuid);
		console.log(`User<${uuid}> reconnected`);
	}
	
	const existing = clientManager.getByUuid(uuid);
	if (existing)
	{
		const oldSocket = existing.socket;
		clientManager.rebindSocket(oldSocket.id, socket.id);
		existing.socket = socket;
		registerEventHandlers(socket, existing);
		if (existing.party)
			existing.emit("party_state", existing.party.getState());
		oldSocket.disconnect(true);
		console.log(`User<${uuid}> switched sockets: ${oldSocket.id} -> ${socket.id}`);
	}
	else
	{
		const client = new Client(uuid, "", socket);
		clientManager.add(client);
		registerEventHandlers(socket, client);
		console.log(`User<${uuid}> connected on socket ${socket.id}`);
	}
	

	// TODO: mark presence as online in Postgres

	socket.on("disconnect", (reason: DisconnectReason) =>
	{
		const client = clientManager.getBySocketId(socket.id);

		if (!client)
			return ;
		if (INTENTIONAL_DISCONNECT_REASONS.has(reason))
			finalizeRemoval(uuid, reason);
		else
		{
			const timer = setTimeout(() =>
			{
				finalizeRemoval(uuid, "reconnection grace period ended");
				pendingRemovals.delete(uuid);
			}, RECONNECT_GRACE_PERIOD_MS);

			pendingRemovals.set(uuid, timer);
			console.log(`User<${uuid}> disconnected unintentionally. Waiting for reconnection`)
		}
	});
});

function finalizeRemoval(uuid: string, reason: string)
{
	clientManager.removeByUuid(uuid);
	console.log(`User<${uuid}> disconnected - ${reason}`);

	// TODO: mark presence as offline in Postgres
}

httpServer.listen(PORT, () => {
	console.log(`Socket.IO server listening on port ${PORT}`);
});
