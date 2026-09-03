import type { Request, Response } from "express";
import { drizzleFriendRequestStore } from "../../stores/drizzle/drizzleFriendRequestStore";
import { drizzleFriendshipStore } from "../../stores/drizzle/drizzleFriendshipStore";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";
import { getRouteParam } from "../../utils/getRouteParam";

export async function acceptFriendRequest(req: Request, res: Response): Promise<void> {
  // req.params.id is the friend REQUEST's own row id — senderId/receiverId
  // come bundled inside the object findRequestId returns, not from the URL
  const requestId = getRouteParam(req.params.id);
  if (!requestId) {
    res.status(400).json({ error: "invalid request id" });
    return;
  }
  
  const request = await drizzleFriendRequestStore.findRequestId(requestId);
  if (!request) {
    res.status(404).end();
    return;
  }

  // irreversible: only a still-Pending request can be accepted
  if (request.status !== "Pending") {
    res.status(409).json({ error: `this request was already ${request.status} — it can't be changed` });
    return;
  }

  await drizzleFriendRequestStore.updateStatus(request.id, "Accepted");

  if (!(await drizzleFriendshipStore.areFriends(request.senderId, request.receiverId))) {
    await drizzleFriendshipStore.add(request.senderId, request.receiverId);
  }
  // if the other person had also sent a request the other way, close it too
  await drizzleFriendRequestStore.updatePendingRequest(request.senderId, request.receiverId, "Accepted");

  notify(request.senderId, EVENTS.FRIEND_REQUEST_ACCEPTED, { by: request.receiverId, requestId: request.id });
  notify(request.receiverId, EVENTS.FRIENDS_LIST_UPDATED, { newFriend: request.senderId });
  notify(request.senderId, EVENTS.FRIENDS_LIST_UPDATED, { newFriend: request.receiverId });

  res.json({ ...request, status: "Accepted" });
}
