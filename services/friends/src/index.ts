import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import { friendRequestsRouter } from "./routes/friend-requests.routes";
import { friendshipsRouter } from "./routes/friendships.routes";
import { eventsRouter } from "./routes/events.routes";

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

// app.listen(PORT, () => console.log(`friends on :${PORT}`));
const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});