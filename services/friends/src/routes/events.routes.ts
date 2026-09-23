import { Router } from "express";
import { streamEvents } from "../handlers/events/streamEvents";

export const eventsRouter = Router();

eventsRouter.get("/events/:ownerUuid", streamEvents);
