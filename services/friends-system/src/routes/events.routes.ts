import { Router } from "express";
import { sseRegistry } from "../events/SseRegistry";
import { EVENTS } from "../events/eventNames";

export const eventsRouter = Router();

eventsRouter.get("/events", (req, res) => {
  const uuid = req.query.uuid as string;
  if (!uuid) {
    res.status(400).end();
    return;
  }

  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();

  sseRegistry.register(uuid, res);
  res.write(`event: ${EVENTS.CONNECTED}\ndata: "ok"\n\n`);

  req.on("close", () => sseRegistry.unregister(uuid, res));
});
