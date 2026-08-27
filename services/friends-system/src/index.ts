import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import { friendRequestsRouter } from "./routes/friend-requests.routes";
import { friendsRouter } from "./routes/friends.routes";
import { eventsRouter } from "./routes/events.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use(eventsRouter);
app.use(friendRequestsRouter);
app.use(friendsRouter);

app.listen(PORT, () => console.log(`friends-system on :${PORT}`));
