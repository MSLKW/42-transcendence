import type { Request, Response } from "express";
import { drizzleFriendshipRepository } from "../../repositories/drizzle/DrizzleFriendshipRepository";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";
import { getRouteParam } from "../../utils/getRouteParam";
import { isValidUuid } from "../../utils/isValidUuid";

export async function removeFriend(req: Request, res: Response): Promise<void> {
  const ownerUuid = getRouteParam(req.params.ownerUuid);
  const friendUuid = getRouteParam(req.params.friendUuid);

  if (!ownerUuid)
  {
    res.status(400).json({ error: "ownerUuid must be 1 string only, not invalid or missing" });
    return;
  }
  if (!friendUuid) 
  {
    res.status(400).json({ error: "friendUuid must be 1 string only, not invalid or missing" });
    return;
  }

  if (!isValidUuid(ownerUuid))
  {
    res.status(400).json({ error: "ownerUuid must not be a malformed uuid" });
    return;
  }
  if (!isValidUuid(friendUuid))
  {
    res.status(400).json({ error: "friendUuid must not be a malformed uuid" });
    return;
  }

  const removed = await drizzleFriendshipRepository.remove(ownerUuid, friendUuid);
  if (!removed) {
    res.status(404).end();
    return;
  }

  // intentionally no notify() call to friendUuid — removal is silent, by design
  notify(ownerUuid, EVENTS.FRIENDS_LIST_UPDATED, { removedFriend: friendUuid });
  res.status(204).end();
}
