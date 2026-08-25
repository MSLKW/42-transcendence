import "dotenv/config";
import express from "express";
import { UserStore } from "./store/UserStore";
import { FileUserStore } from "./store/FileUserStore";

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

const userStore: UserStore = new FileUserStore;

const app = express();
app.use(express.json());
app.use(express.static("test"));

app.get("/health", healthCheck());
app.get("/search", userSearch());

app.get("/profile/:uuid", getUserProfile());
app.get("/settings/:uuid", getUserSettings());

app.put("/profile", setUserProfile());
app.put("/settings", setUserSettings());
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