import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";
import { isValidUuid } from "../../utils/isValidUuid";
import { getRouteParam } from "../../utils/getRouteParam";

export async function listReceivedRequests(req: Request, res: Response): Promise<void> {
  const receiverUuid = getRouteParam(req.params.receiverUuid);

  if (!receiverUuid)
  {
    res.status(400).json({ error: "request ids are missing" });
    return;
  }
  if (!isValidUuid(receiverUuid))
  {
    res.status(400).json({ error: "request ids must not be malformed id" });
    return;
  }
  
  res.json(await drizzleFriendRequestRepository.listReceivedAndPending(receiverUuid));
}
