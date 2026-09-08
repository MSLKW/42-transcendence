import "dotenv/config";
import express from "express";
import { UserStore } from "./store/UserStore";
// import { FileUserStore } from "./store/FileUserStore";
import { DrizzleUserStore } from "./store/DrizzleUserStore";

import { healthCheck } from "./handlers/healthCheck";
import { userSearch } from "./handlers/userSearch";

import { getUserProfile } from "./handlers/getUserProfile";
import { getUserSettings } from "./handlers/getUserSettings"

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

app.use((req, res, next) => {
	console.log(`[DEBUG] ${req.method} ${req.url} | Host: ${req.headers.host}`);
	next();
});


app.use(express.json());
app.use(express.static("test"));

app.get("/health", healthCheck());
app.get("/search/:query", userSearch(userStore));

app.get("/profile/:uuid", getUserProfile(userStore));
app.get("/settings/:uuid", getUserSettings(userStore));

app.put("/profile", setUserProfile(userStore));
app.put("/settings", setUserSettings(userStore));
app.put("/avatar", uploadAvatar());

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