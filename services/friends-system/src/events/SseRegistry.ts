import type { Response } from "express";

// Enforces "exactly one live SSE connection per uuid" — a second connection
// for the same uuid replaces the first.
class SseRegistry {
  private clients: Record<string, Response> = {};

  register(uuid: string, res: Response): void {
    const existing = this.clients[uuid];
    if (existing) existing.end();
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