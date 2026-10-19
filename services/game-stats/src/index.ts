import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import { isDbDown, closePostgresClientPool } from "@big2/postgres-client";
import { DrizzleGameStatsRepository } from "./repositories/drizzle/DrizzleGameStatsRepository";
import { createBrowserFacingRouter } from "./routes/browser-facing.routes";
import { createInternalRouter } from "./routes/internal.routes";


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

const repository = new DrizzleGameStatsRepository();
app.use(createBrowserFacingRouter(repository));
app.use(createInternalRouter(repository));


// Central error handler (register AFTER all routes). 
// DB down -> 503 + 
// Retry-After so callers know to retry; 
// anything else is a real bug -> 500.
// without central error handler, Express’s built-in default error handler sends it. 
// It replies with status 500 too, but outside production it includes the stack trace in the response body, 
// which you don’t want a client to see.
// set("Retry-After", "2") adds an HTTP response header. The line means: “I’m unavailable right now, so try again after 2 seconds.”
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (isDbDown(err))
	{
		console.error("Database unavailable:", err);
		return res.status(503).set("Retry-After", "2").json({ error: "database_unavailable" });
	}
	console.error("Unhandled error:", err);
	return res.status(500).json({ error: "internal_error" });
});


const server = app.listen(PORT, () => {
	console.log(`Game-Stats Server is running on http://localhost:${PORT}`);
});


// Graceful shutdown on Ctrl+C / `docker compose down` & `docker compose stop` (both stop containers the same way). 
// Stop taking new requests, close the DB
// pool cleanly, then exit, well inside Docker's 10s SIGKILL deadline.
async function shutdown() {
  server.close();					// 1. stop accepting new work
  									// 2. service-specific cleanup // TODO (signal handler) : recheck this after service completion
  await closePostgresClientPool();	// 3. close DB pool (DB services only)
  process.exit(0);					// 4. end the process, exit code 0 = clean shutdown
}
process.on('SIGINT', shutdown);		// Ctrl+C
process.on('SIGTERM', shutdown);	// `docker compose down` & `docker compose stop` (both stop containers the same way)
