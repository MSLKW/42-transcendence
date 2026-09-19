import { sseRegistry } from "../../events/SseRegistry";
import { EVENTS } from "../../events/eventNames";
import { fetchJson } from "../../utils/fetchJson";
import { AUTH_SERVICE_URL } from "../../config/env";
import { isValidUuid } from "../../utils/isValidUuid";
import { getRouteParam } from "../../utils/getRouteParam";
import { Request, Response } from "express";


export async function streamEvents(req: Request, res: Response): Promise<void> 
{
  const ownerUuid = getRouteParam(req.params.ownerUuid);

  // check if ownerUuid is empty
  if (!ownerUuid) 
  {
	res.status(400).end();
	return;
  }

  // The 23503/22P02/23505 codes only exist in sendFriendRequest handler coz it directly writes a row to Postgres
  // in /events here, none of these can arise coz there are zero interaction between /events & Postgres. 
  // but we can still helpfully avoid wasted round trips by 
  // making a precheck on the ownerUuid validity first, only the we run internal REST API fetches
  if (!isValidUuid(ownerUuid))
  {
	res.status(400).end();
	return;
  }

  // Check if receiverId exists in Postgres (auth-schema's users table)
  try 
  {
	await fetchJson(`${AUTH_SERVICE_URL}/internal/friends/uuidexistance/${ownerUuid}`);
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

  sseRegistry.register(ownerUuid, res);
  res.write(`event: ${EVENTS.CONNECTED}\ndata: "ok"\n\n`);

  req.on("close", () => sseRegistry.unregister(ownerUuid, res));
}
