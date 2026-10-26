import type { Request, Response } from "express";
import { drizzleFriendshipRepository } from "../../repositories/drizzle/DrizzleFriendshipRepository";
import { isValidUuid } from "../../utils/isValidUuid";
import { getRouteParam } from "../../utils/getRouteParam";

export async function listFriends(req: Request, res: Response): Promise<void> {
  const ownerUuid = getRouteParam(req.params.ownerUuid);
  if (!ownerUuid)
  {
    res.status(400).json({ error: "ownerUuid must be 1 string only, not invalid or missing" });
    return;
  }

  if (!isValidUuid(ownerUuid))
  {
    res.status(400).json({ error: "ownerUuid must not be a malformed ownerUuid" });
    return;
  }
  
  res.json(await drizzleFriendshipRepository.fullFriendList(ownerUuid));
}
