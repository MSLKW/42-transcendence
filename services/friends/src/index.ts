import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import { friendRequestsRouter } from "./routes/friend-requests.routes";
import { friendshipsRouter } from "./routes/friendships.routes";
import { eventsRouter } from "./routes/events.routes";

// TODO (signal handler): uncomment this when need to implement the signal handler
// import { isDbDown, closePostgresClientPool } from "@big2/postgres-client";

const app = express();
app.use(express.json());
app.use(cors());
// TODO: restrict to actual frontend origin before production, examples like below:
// app.use(cors({ 
// 	origin: ["http://localhost:5173", "https://your-real-domain.com"], 
// 	credentials: true 
// }));
//
// app.use(cors({ 
// 	origin: process.env.WEBSITE_URL, 
// 	credentials: true 
// }));
// 
// notes:
// credentials: true => tells browser & server to allow sensitive auth data (cookies, HTTP authorization headers, TLS client cert) sent across different origins.
// Must specify exact origin to use credentials: true, wildcards (*) are strictly forbidden.

app.use(eventsRouter);
app.use(friendRequestsRouter);
app.use(friendshipsRouter);

// TODO (signal handler): uncomment this when need to implement the signal handler
// // Central error handler (register AFTER all routes). DB down -> 503 + Retry-After so callers
// // know to retry; anything else is a real bug -> 500.
// app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
// 	if (isDbDown(err))
//     	return res.status(503).set("Retry-After", "2").json({ error: "database_unavailable" });
// 	console.error("Unhandled error:", err);
// 	return res.status(500).json({ error: "Something went wrong." });
// });

// app.listen(PORT, () => console.log(`friends on :${PORT}`));
const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

// TODO (signal handler): uncomment this when need to implement the signal handler
// // Graceful shutdown on Ctrl+C / `docker compose down`. 
// // Stop taking new requests, close the DB
// // pool cleanly, then exit, well inside Docker's 10s SIGKILL deadline.
// async function shutdown() {
//   server.close();					// 1. stop accepting new work
//   server.closeAllConnections();		// 2. service-specific cleanup (stops SSE streams in friends)
//   await closePostgresClientPool();	// 3. close DB pool (DB services only)
//   process.exit(0);					// 4. end the process, exit code 0 = clean shutdown
// }
// process.on('SIGINT', shutdown);		// Ctrl+C
// process.on('SIGTERM', shutdown);	// `docker compose down`
