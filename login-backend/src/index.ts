import "dotenv/config";
import express from "express";
import { FileUserStore } from "./store/fileUserStore";
import { FileSessionStore } from "./store/fileSessionStore";
import { signupHandler } from "./handlers/signup";
import { signinHandler } from "./handlers/signin";
import { logoutHandler } from "./handlers/logout";
import { validateSessionHandler } from "./handlers/validateSession";

const app = express();
app.use(express.json());

//replace with actual db user store class like MongoUserStore()
const userStore = new FileUserStore();
const sessionStore = new FileSessionStore();

app.post("/signup", signupHandler(userStore));
app.post("/signin", signinHandler(userStore, sessionStore));
app.delete("/logout", logoutHandler(sessionStore));
app.post("/validate", validateSessionHandler(sessionStore));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err.type === "entity.parse.failed") {
		return res.status(400).json({ error: "Malformed JSON in request body." });
	}
	console.error("Unhandled error:", err);
	return res.status(500).json({ error: "Something went wrong." });
});

const PORT = 3000;
const ERROR_MESSAGES = {
	EADDRINUSE: `Port ${PORT} is already in use.`,
	EACCES: `Insufficient permissions to bind to port ${PORT}.`,
	EADDRNOTAVAIL: "The specified address is not available."
};

const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
	console.error(
		ERROR_MESSAGES[err.code] ??
		`Unexpected server error (${err.code}): ${err.message}`
	);
	process.exit(1);
});
