import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import { friendRequestsRouter } from "./routes/friend-requests.routes";
import { friendshipsRouter } from "./routes/friendships.routes";
import { eventsRouter } from "./routes/events.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use(eventsRouter);
app.use(friendRequestsRouter);
app.use(friendshipsRouter);

// app.listen(PORT, () => console.log(`friends-system on :${PORT}`));
const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});