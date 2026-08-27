import { sseRegistry } from "./SseRegistry";

// The one function every handler calls to push something live to a user.
// Silently does nothing if that uuid isn't connected right now.
export function notify(uuid: string, event: string, data: unknown): void {
  const res = sseRegistry.get(uuid);
  if (res) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}
