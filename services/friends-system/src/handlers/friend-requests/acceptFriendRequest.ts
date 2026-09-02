import type { Request, Response } from "express";
import { friendRequests, friendships, areFriends } from "../../store/memoryFriendData";
import { pairKey } from "../../utils/pairKey";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";

export function acceptFriendRequest(req: Request, res: Response): void {
  const request = friendRequests.find(r => r.id === req.params.id);
  if (!request) {
    res.status(404).end();
    return;
  }

  // irreversible: only a still-pending request can be accepted
  if (request.status !== "Pending") {
    res.status(409).json({ error: `this request was already ${request.status} — it can't be changed` });
    return;
  }

  request.status = "Accepted";

  if (!areFriends(request.senderId, request.receiverId)) {
    friendships.push({ a: request.senderId, b: request.receiverId });
  }
  // any other pending request between the same two people is now redundant — auto-close it
  friendRequests
    .filter(r => r.status === "Pending" && pairKey(r.senderId, r.receiverId) === pairKey(request.senderId, request.receiverId))
    .forEach(r => { r.status = "Accepted"; });

  notify(request.senderId, EVENTS.FRIEND_REQUEST_ACCEPTED, { by: request.receiverId, requestId: request.id });
  notify(request.receiverId, EVENTS.FRIENDS_LIST_UPDATED, { newFriend: request.senderId });
  notify(request.senderId, EVENTS.FRIENDS_LIST_UPDATED, { newFriend: request.receiverId });

  res.json(request);
}
