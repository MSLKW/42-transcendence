import "dotenv/config";
import express from "express";
import { UserStore } from "./store/UserStore";
import { FileUserStore } from "./store/FileUserStore";

import { healthCheck } from "./handlers/healthCheck";
import { userSearch, userSearchExact } from "./handlers/userSearch";

import { getUserProfile } from "./handlers/getUserProfile";
import { getUserSettings } from "./handlers/getUserSettings"

import { setUserProfile } from "./handlers/setUserProfile";
import { setUserSettings } from "./handlers/setUserSettings";
import { uploadAvatar } from "./handlers/uploadAvatar";

import { closeDb } from "./db/closeDb";

const PORT = process.env.PORT || 3000;
const ERROR_MESSAGES: Record<string, string> = {
	EADDRINUSE: `Port ${PORT} is already in use.`,
	EACCES: `Insufficient permissions to bind to port ${PORT}.`,
	EADDRNOTAVAIL: "The specified address is not available."
};

const userStore: UserStore = new FileUserStore;

const app = express();
app.use(express.json());
app.use(express.static("test"));

app.get("/health", healthCheck());
app.get("/search/:query", userSearch(userStore));
app.get("/search-exact/:username", userSearchExact(userStore))

app.get("/profile/:uuid", getUserProfile(userStore));
app.get("/settings/:uuid", getUserSettings(userStore));

app.put("/profile", setUserProfile(userStore));
app.put("/settings", setUserSettings(userStore));
app.put("/avatar", uploadAvatar());

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err.type === "entity.parse.failed")
		return res.status(400).json({ error: "Malformed JSON in request body." });
	console.error("Unhandled error", err);
	return res.status(500).json({ error: "Something went wrong" });
});

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

let shuttingDown = false;
async function shutdown()
{
	if (shuttingDown)
		return ;
	shuttingDown = true;
	server.close();
	await closeDb();
	process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);