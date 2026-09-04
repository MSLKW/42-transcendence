import type { Request, Response } from "express";
import { drizzleFriendshipStore } from "../../stores/drizzle/drizzleFriendshipStore";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";
import { getRouteParam } from "../../utils/getRouteParam";

export async function removeFriend(req: Request, res: Response): Promise<void> {
  const uuid = req.query.uuid as string;
  // const friendUuid = req.params.friendUuid;
  const friendUuid = getRouteParam(req.params.friendUuid);
  if (!friendUuid) {
    res.status(400).json({ error: "invalid friend uuid" });
    return;
  }

  const removed = await drizzleFriendshipStore.remove(uuid, friendUuid);
  if (!removed) {
    res.status(404).end();
    return;
  }

  // intentionally no notify() call to friendUuid — removal is silent, by design
  notify(uuid, EVENTS.FRIENDS_LIST_UPDATED, { removedFriend: friendUuid });
  res.status(204).end();
}
