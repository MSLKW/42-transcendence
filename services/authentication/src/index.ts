import "dotenv/config";
import express from "express";
import { DrizzleUserStore } from "./store/drizzleUserStore";
import { DrizzleSessionStore } from "./store/drizzleSessionStore";
import cookieParser from "cookie-parser";
import { signupHandler } from "./handlers/signup";
import { signinHandler } from "./handlers/signin";
import { guestHandler } from "./handlers/guest";
import { logoutHandler } from "./handlers/logout";
import { validateSessionHandler } from "./handlers/validateSession";
import { getCreatedAt } from "./handlers/getCreatedAt";
import { scheduleSessionCleanup } from "./jobs/ScheduleSessionCleanup";
// by aisyah
import { checkUserExistanceForFriends } from "./routes/checkUserExistanceForFriends";


const app = express();
app.use(express.json());
app.use(cookieParser());

//replace with actual db user store class like MongoUserStore()
const userStore = new DrizzleUserStore();
const sessionStore = new DrizzleSessionStore();

app.post("/signup", signupHandler(userStore));
app.post("/signin", signinHandler(userStore, sessionStore));
app.post("/guest", guestHandler(sessionStore));
app.delete("/logout", logoutHandler(sessionStore));
app.get("/validate", validateSessionHandler(sessionStore));
app.get("/created-at/:uuid", getCreatedAt(userStore));
scheduleSessionCleanup(sessionStore);

// by aisyah
app.get("/internal/friends/uuidexistance/:uuid", checkUserExistanceForFriends());
app.get("/", (req, res) => res.sendStatus(200)); // temporary healthcheck only, to enable docker run 

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err.type === "entity.parse.failed") {
		return res.status(400).json({ error: "Malformed JSON in request body." });
	}
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
