import type { Response } from "express";
import { EVENTS } from "./eventNames";

// Enforces "exactly one live SSE connection per uuid"
// Second/most latest connection for the same uuid replaces the first.
class SseRegistry {
  private clients: Record<string, Response> = {};

  register(uuid: string, res: Response): void {
    const existing = this.clients[uuid];
    if (existing) {
      // tell the OLD connection why it's closing, before closing it —
      // this is what lets that browser tab choose not to auto-reconnect
      existing.write(`event: ${EVENTS.REPLACED}\ndata: "connected from elsewhere"\n\n`);
      existing.end();
    }
    this.clients[uuid] = res;
  }

  // only removes if `res` is still the current connection for that uuid —
  // guards against a late cleanup from an old connection wiping out a
  // newer one that already took its place
  unregister(uuid: string, res: Response): void {
    if (this.clients[uuid] === res) delete this.clients[uuid];
  }

  get(uuid: string): Response | undefined {
    return this.clients[uuid];
  }
}

export const sseRegistry = new SseRegistry();