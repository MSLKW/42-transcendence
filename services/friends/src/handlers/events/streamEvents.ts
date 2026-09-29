import { sseRegistry } from "../../events/SseRegistry";
import { EVENTS } from "../../events/eventNames";
import { AUTH_SERVICE_URL } from "../../config/env";
import { Request, Response } from "express";


export async function streamEvents(req: Request, res: Response): Promise<void> 
{
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) 
  {
    // 404 vs 401. 404 describes the URL, not the cookie. 
    // The /events route exists, so "not found" is wrong. 
    // 401 means "you aren't authenticated", which is what a missing cookie is.
    res.status(401).json({ error: "Missing session cookie." });
    return;
  }

  let ok = false;
  let status = 500;
  let body: unknown = null;

  try 
  {
	  // const authRes = await fetch(`${AUTH_SERVICE_URL}/validate`, 
    // {
    //   headers: { Authorization: `Bearer ${cookieHeader}`},
    //   signal: AbortSignal.timeout(3000),
    // });
    const authRes = await fetch(`${AUTH_SERVICE_URL}/validate`, { 
      headers: { Cookie: cookieHeader },
      signal: AbortSignal.timeout(3000), // aborts after 3000ms (3seconds)
    }); 

    ok = authRes.ok;
    status = authRes.status;

    try
    {
      body = await authRes.json();
    }
    catch
    {
      body = null;
    }
  }
  catch 
  {
    // fetch threw: timeout / connection refused / DNS failure / etc
    res.status(503).json(body ?? { error: "Auth service unavailable." });
    return;
  }

  // auth response status is an error, pass its specific status and body
  if (!ok)
  {
    res.status(status).json({ error: "Session validation failed." });
    return;
  }
  
  if (typeof body !== "object" ||
      body === null ||
      !("userId" in body) ||
      typeof body.userId !== "string")
  {
    res.status(502).json({ error: "Unexpected response from auth service." });
    return;
  }

  const userId = body.userId;

  // client disconnected while waiting on auth fetching
  if (res.destroyed)
    return;

  res.set({ 
    "Content-Type": "text/event-stream", 
    "Cache-Control": "no-cache", 
    "Connection": "keep-alive",
  });
  res.flushHeaders();

  sseRegistry.register(userId, res);
  res.write(`event: ${EVENTS.CONNECTED}\ndata: "ok"\n\n`);

  // heartbeat complements nginx's proxy_read_timeout
  // Heartbeat (25s ping): Prevents network timeouts and catches dead clients.
  // Fixes wire idleness (silent network path), not user idleness (inactive on page).
  // Covers network hops outside Nginx that proxy_read_timeout cannot reach.
  // Clean close (tab closed)             : Sends goodbye -> connection closes instantly.
  // Silent drop (Wi-Fi lost, lid closed) : No goodbye -> Nginx only detects via next failed writes.
  // Without heartbeat: Silent Nginx -> dead clients linger indefinitely.
  // With heartbeat: Ping nginx can't deliver → TCP retries → dead client dropped, "close" fires here.
  // 25s is ideal => many proxies' idle limits of 30s-60s, 30s is right on the edge.
  const heartbeat = setInterval(() =>
  {
    res.write(": ping\n\n");
  }, 25_000);

  // res.on("close", () => sseRegistry.unregister(userId, res));
  res.on("close", () => 
  {
    clearInterval(heartbeat);
    sseRegistry.unregister(userId, res);
  });
}
