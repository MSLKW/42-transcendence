import { Server } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import { PartyManager } from "./party/PartyManager";
import { createHttpRequestHandler } from "./http/handlers";
import { createSocketAuthentication } from "./server/authentication";
import { registerConnections } from "./server/connections";
import { clientManager } from "./client/ClientManager";

const PORT = Number(process.env.PORT) || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");
const SOCKET_CHAT_PATH = process.env.SOCKET_CHAT_PATH;
if (!SOCKET_CHAT_PATH)
	throw new Error("SOCKET_CHAT_PATH is not set");

let isShuttingDown = false;
const io = new Server<ClientToServerEvents, ServerToClientEvents>({
	cors: { origin: "*" },
	path: SOCKET_CHAT_PATH, // Engine.IO normalizes a trailing slash on the path.
});

const partyManager = new PartyManager(io);
const httpServer = createServer(createHttpRequestHandler(partyManager, () => isShuttingDown));
io.attach(httpServer);

io.use(createSocketAuthentication(AUTH_SERVICE_URL, () => isShuttingDown));
registerConnections(io, partyManager, () => isShuttingDown);

httpServer.listen(PORT, () => {
	console.log(`Chat Socket.IO server listening on port ${PORT}`);
});

//stops accepting work and closes the chat service gracefully
function shutdown(signal: NodeJS.Signals): void {
	if (isShuttingDown)
		return;

	isShuttingDown = true;
	console.log(`Received ${signal}. Shutting down chat service...`);
	clientManager.clearAllPendingRemovals();

	const forceExitTimer = setTimeout(() => {
		console.error("Graceful shutdown timed out. Forcing exit");
		process.exit(1);
	}, 8_000);
	forceExitTimer.unref();

	io.close(() => {
		clearTimeout(forceExitTimer);
		console.log("Chat service shut down successfully");
		process.exitCode = 0;
	});
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
