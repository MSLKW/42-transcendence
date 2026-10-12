import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
// import { FileUserStore } from "./store/fileUserStore";
// import { FileSessionStore } from "./store/fileSessionStore";
import { DrizzleUserStore } from "./store/drizzleUserStore";
import { DrizzleSessionStore } from "./store/drizzleSessionStore";

// TODO (signal handler): uncomment this when need to implement the signal handler
// import { isDbDown, closePostgresClientPool } from "@big2/postgres-client";

import { signupHandler } from "./handlers/signup";
import { signinHandler } from "./handlers/signin";
import { guestHandler } from "./handlers/guest";
import { logoutHandler } from "./handlers/logout";
import { validateSessionHandler } from "./handlers/validateSession";
import { getCreatedAt } from "./handlers/getCreatedAt";
import { scheduleSessionCleanup } from "./jobs/ScheduleSessionCleanup";

const app = express();
app.use(express.json());
app.use(cookieParser());

//replace with actual db user store class like MongoUserStore()
// const userStore = new FileUserStore();
// const sessionStore = new FileSessionStore();
const userStore = new DrizzleUserStore();
const sessionStore = new DrizzleSessionStore();

app.post("/signup", signupHandler(userStore));
app.post("/signin", signinHandler(userStore, sessionStore));
app.post("/guest", guestHandler(sessionStore));
app.delete("/logout", logoutHandler(sessionStore));
app.get("/validate", validateSessionHandler(sessionStore));
app.get("/created-at/:uuid", getCreatedAt(userStore));


scheduleSessionCleanup(sessionStore);
// TODO (signal handler): uncomment this when need to implement the signal handler, and comment the 1 line above
// const cronCleanupTask = scheduleSessionCleanup(sessionStore);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err.type === "entity.parse.failed") {
		return res.status(400).json({ error: "Malformed JSON in request body." });
	}

	// TODO (signal handler): uncomment this when need to implement the signal handler
	// if (isDbDown(err)) {
	// 	return res.status(503).set("Retry-After", "2").json({ error: "database_unavailable" });
	// }

	console.error("Unhandled error:", err);
	return res.status(500).json({ error: "Something went wrong." });
});

const PORT = Number(process.env.PORT) || 3000;
const ERROR_MESSAGES: Record<string, string> = {
	EADDRINUSE: `Port ${PORT} is already in use.`,
	EACCES: `Insufficient permissions to bind to port ${PORT}.`,
	EADDRNOTAVAIL: "The specified address is not available."
};

const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
	console.error(
		(err.code !== undefined ? ERROR_MESSAGES[err.code] : undefined) ??
		`Unexpected server error (${err.code}): ${err.message}`
	);
	process.exit(1);
});

// TODO (signal handler): uncomment this when need to implement the signal handler
// // Graceful shutdown on Ctrl+C / `docker compose down` & `docker compose stop` (both stop containers the same way). 
// // Stop new work, stop the cron job, close the DB pool, then exit, well inside Docker's 10s SIGKILL.
// let shuttingDown = false;
// async function shutdown() {
// 	if (shuttingDown)
// 		return;
// 	shuttingDown = true;
// 	setTimeout(() => process.exit(1), 8000).unref();	// failsafe: force exit if cleanup hangs

// 	server.close();						// 1. stop accepting new work
// 	cronCleanupTask.stop();				// 2. service-specific cleanup (stop cron for auth)
// 	await closePostgresClientPool();	// 3. close DB pool (DB services only)
// 	process.exit(0);					// 4. end the process, exit code 0 = clean shutdown
// }

// process.on('SIGINT', shutdown);			// Ctrl+C
// process.on('SIGTERM', shutdown);		// `docker compose down` & `docker compose stop` (both stop containers the same way)
