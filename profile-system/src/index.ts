import "dotenv/config";
import express from "express";
import { healthCheck } from "./handlers/healthCheck";
import { getProfile } from "./handlers/getProfile";
import { setUsername } from "./handlers/setUsername";
import { setUserSettings } from "./handlers/setUserSettings";
import { uploadAvatar } from "./handlers/uploadAvatar";

const PORT = process.env.PORT || 3000;
const ERROR_MESSAGES: Record<string, string> = {
	EADDRINUSE: `Port ${PORT} is already in use.`,
	EACCES: `Insufficient permissions to bind to port ${PORT}.`,
	EADDRNOTAVAIL: "The specified address is not available."
};

const app = express();
app.use(express.json());
app.use(express.static("test"));

app.get("/health", healthCheck());
app.get("/:uuid", getProfile());
app.put("/username", setUsername());
app.put("/settings", setUserSettings())
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