import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";
import { isValidUuid } from "../../utils/isValidUuid";
import { getRouteParam } from "../../utils/getRouteParam";

export async function listSentRequests(req: Request, res: Response): Promise<void> {
  const senderUuid = getRouteParam(req.params.senderUuid);

  if (!senderUuid)
  {
    res.status(400).json({ error: "senderUuid must be 1 string only, not invalid or missing" });
    return;
  }
  if (!isValidUuid(senderUuid))
  {
    res.status(400).json({ error: "senderUuid must not be malformed uuid" });
    return;
  }

  res.json(await drizzleFriendRequestRepository.listSent(senderUuid));
}
