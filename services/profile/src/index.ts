import "dotenv/config";
import express from "express";
import { UserStore } from "./store/UserStore";
// import { FileUserStore } from "./store/FileUserStore";
import { DrizzleUserStore } from "./store/DrizzleUserStore";

// TODO (signal handler): uncomment this when need to implement the signal handler
// import { isDbDown, closePostgresClientPool } from "@big2/postgres-client";

import { healthCheck } from "./handlers/healthCheck";
import { userSearch, userSearchExact } from "./handlers/userSearch";

import { getUserProfile } from "./handlers/getUserProfile";
import { getUserSettings } from "./handlers/getUserSettings";

import { setUserProfile } from "./handlers/setUserProfile";
import { setUserSettings } from "./handlers/setUserSettings";
import { uploadAvatar } from "./handlers/uploadAvatar";

const PORT = process.env.PORT || 3000;
const ERROR_MESSAGES: Record<string, string> = {
	EADDRINUSE: `Port ${PORT} is already in use.`,
	EACCES: `Insufficient permissions to bind to port ${PORT}.`,
	EADDRNOTAVAIL: "The specified address is not available."
};

// const userStore: UserStore = new FileUserStore;
const userStore: UserStore = new DrizzleUserStore;

const app = express();
app.use(express.json());
app.use(express.static("test"));

app.get("/health", healthCheck());
app.get("/search/:query", userSearch(userStore));
app.get("/search-exact/:username", userSearchExact(userStore));

app.get("/profile/:uuid", getUserProfile(userStore));
app.get("/settings/:uuid", getUserSettings(userStore));

app.put("/profile", setUserProfile(userStore));
app.put("/settings", setUserSettings(userStore));
app.put("/avatar", uploadAvatar());

// TODO (signal handler): uncomment this when need to implement the signal handler
// // // Central error handler (register AFTER all routes). 
// // DB down -> 503 + Retry-After so callers know to retry; anything else is a real bug -> 500.
// app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
// 	if (isDbDown(err))
//     	return res.status(503).set("Retry-After", "2").json({ error: "database_unavailable" });
// 	console.error("Unhandled error:", err);
// 	return res.status(500).json({ error: "Something went wrong." });
// });

const server = app.listen(PORT, () =>
{
	console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) =>
{
	console.error(
		(err.code !== undefined ? ERROR_MESSAGES[err.code] : undefined) ??
		`Unexpected server error ${err.code}: ${err.message}`
	);
	process.exit(1);
});

// TODO (signal handler): uncomment this when need to implement the signal handler
// // Graceful shutdown on Ctrl+C / `docker compose down` & `docker compose stop` (both stop containers the same way). 
// // Stop new work, close the DB pool, then exit, well inside Docker's 10s SIGKILL.
// let shuttingDown = false;
// async function shutdown()
// {
// 	if (shuttingDown)
// 		return;
// 	shuttingDown = true;
// 	setTimeout(() => process.exit(1), 8000).unref();	// failsafe: force exit if cleanup hangs

// 	server.close();						// 1. stop accepting new work
// 										// 2. service-specific cleanup (none for profile)
// 	await closePostgresClientPool();	// 3. close DB pool (DB services only)
// 	process.exit(0);					// 4. end the process, exit code 0 = clean shutdown
// }

// process.on('SIGINT', shutdown);		// Ctrl+C
// process.on('SIGTERM', shutdown);	// `docker compose down` & `docker compose stop` (both stop containers the same way)
