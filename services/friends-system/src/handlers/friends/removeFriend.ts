import type { Request, Response } from "express";
import { friendships } from "../../store/memoryFriendData";
import { pairKey } from "../../utils/pairKey";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";

function getRouteParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export function removeFriend(req: Request, res: Response): void {
  const uuid = req.query.uuid as string;
  const friendUuid = getRouteParam(req.params.friendUuid);

  if (!friendUuid) {
    res.status(400).json({ error: "invalid friend uuid" });
    return;
  }

  const before = friendships.length;
  for (let i = friendships.length - 1; i >= 0; i--) {
    if (pairKey(friendships[i].a, friendships[i].b) === pairKey(uuid, friendUuid)) {
      friendships.splice(i, 1);
    }
  }
  if (friendships.length === before) {
    res.status(404).end();
    return;
  }

  // intentionally no notify() call to friendUuid — removal is silent, by design
  notify(uuid, EVENTS.FRIENDS_LIST_UPDATED, { removedFriend: friendUuid });
  res.status(204).end();
}
