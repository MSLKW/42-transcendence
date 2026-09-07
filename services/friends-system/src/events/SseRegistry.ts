import type { Response } from "express";
import { EVENTS } from "./eventNames";

// Enforces "exactly one live SSE connection per uuid" 
// not supporting multi-tabs nor multi-devices
// second / latest new connection for the same uuid replaces the first.
// in tester, calling .close() yourself is the actual fix, this is what stops auto-reconnect, not the server closing it
// SseRegistry.ts correctly has no .close() anywhere — it never could, structurally. And this directly means: whoever builds the real website frontend must independently implement that same "replaced" listener + .close() reaction
class SseRegistry {
  private clients: Record<string, Response> = {};

  register(uuid: string, res: Response): void {
    const existing = this.clients[uuid];
    if (existing) {
      // explaining to OLD connection why they're being closed, before officially closing it
      // this is what lets browser choose not to auto-reconnect
      existing.write(`event: ${EVENTS.REPLACED}\ndata: "connected from elsewhere, priotizing latest new created connection"\n\n`)
      existing.end();
    }
    this.clients[uuid] = res;
  }

  // only removes if `res` is still the current connection for that uuid
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