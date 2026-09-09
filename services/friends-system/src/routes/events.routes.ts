import { Router } from "express";
import { sseRegistry } from "../events/SseRegistry";
import { EVENTS } from "../events/eventNames";
import { fetchJson } from "../utils/fetchJson";
import { AUTH_SERVICE_URL } from "../config/env";

export const eventsRouter = Router();

eventsRouter.get("/events", async (req, res) => {
  const uuid = req.query.uuid as string;
  if (!uuid) {
    res.status(400).end();
    return;
  }

  // Check if receiverId exists in Postgres (auth-schema's users table)
  try 
  {
    await fetchJson(`${AUTH_SERVICE_URL}/internal/friends/${uuid}`);
  } 
  catch (err: any) 
  {
    // fetchJson throws on ANY non-ok response (404, 500, timeout, etc.) —
    // for our purposes here, any failure means "treat as not found"
    res.status(404).end();
    return;
  }
  
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();

  sseRegistry.register(uuid, res);
  res.write(`event: ${EVENTS.CONNECTED}\ndata: "ok"\n\n`);

  req.on("close", () => sseRegistry.unregister(uuid, res));
});
