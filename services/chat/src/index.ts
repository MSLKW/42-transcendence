import { Server } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import { PartyManager } from "./party/PartyManager";
import { createHttpRequestHandler } from "./http/handlers";
import { createSocketAuthentication } from "./server/authentication";
import { registerConnections } from "./server/connections";
import { clientManager } from "./client/ClientManager";

/** Environment config */
const PORT = Number(process.env.PORT) || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");
const SOCKET_CHAT_PATH = process.env.SOCKET_CHAT_PATH;
if (!SOCKET_CHAT_PATH)
	throw new Error("SOCKET_CHAT_PATH is not set");

/** Create socket.io server + initialize party manager class */
const io = new Server<ClientToServerEvents, ServerToClientEvents>({
	cors: { origin: "*" },
	path: SOCKET_CHAT_PATH,
});
const partyManager = new PartyManager(io);
let isShuttingDown = false;

/** Create http server + bind with socket.io server */
const httpServer = createServer(createHttpRequestHandler(partyManager, () => isShuttingDown));
io.attach(httpServer);

/** Connect to auth validation middleware + set up event listeners */
io.use(createSocketAuthentication(AUTH_SERVICE_URL, () => isShuttingDown));
registerConnections(io, partyManager, () => isShuttingDown);

/** Server starts listening for incoming traffic on port */
httpServer.listen(PORT, () => {
	console.log(`Chat Socket.IO server listening on port ${PORT}`);
});

/** Stops accepting work and closes the chat service gracefully */
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
