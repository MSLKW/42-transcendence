import "dotenv/config";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Client } from "./client/Client";
import { clientManager } from "./client/ClientManager";
import { registerEventHandlers } from "./client/event_handlers";

import { PartyState } from "./PartyTransmitTypes";

const PORT = Number(process.env.PORT) || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");

const httpServer = createServer();

const io = new Server(httpServer, {
	cors: {
		origin: "*", // TODO: restrict to actual frontend origin before prod
	},
});

// --- Auth middleware: runs once per handshake, before "connection" fires ---
io.use(async (socket, next) => {
	const token = socket.handshake.auth?.token;

	if (!token || typeof token !== "string")
		return next(new Error("UNAUTHORIZED: no session token provided"));

	try
	{
		const response = await fetch(`${AUTH_SERVICE_URL}/validate`, {
			headers: {
				Authorization: `Bearer ${token}`,
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

io.on("connection", (socket: Socket) => {
	const uuid = socket.data.uuid;
	const existing = clientManager.getByUuid(uuid);

	if (existing)
	{
		const oldSocket = existing.socket;
		clientManager.rebindSocket(oldSocket.id, socket.id);
		existing.socket = socket;
		registerEventHandlers(socket, existing);
		const state: PartyState = {
			inParty: existing.party ? true : false,
			members: existing.party?.getMemberUuids()
		}
		existing.emit("party_state", state);
		oldSocket.disconnect(true);
		console.log(`User switched sockets ${oldSocket.id} -> ${socket.id} (user ${uuid})`);
	}
	else
	{
		const client = new Client(uuid, "", socket);
		clientManager.add(client);
		registerEventHandlers(socket, client);
		console.log(`Client connected: ${socket.id} (user ${uuid})`);
	}
	

	// TODO: mark presence as online in Postgres

	socket.on("disconnect", (reason) =>
	{
		const client = clientManager.getBySocketId(socket.id);

		if (!client)
			return ;
		clientManager.removeBySocketId(socket.id);
		client.party?.removeUser(client.uuid);
		console.log(`Client disconnected: ${socket.id} (user ${uuid}) - ${reason}`);

		// TODO: mark presence as offline in Postgres
	});
});

httpServer.listen(PORT, () => {
	console.log(`Socket.IO server listening on port ${PORT}`);
});