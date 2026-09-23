import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";
import { drizzleFriendshipRepository } from "../../repositories/drizzle/DrizzleFriendshipRepository";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";
import { getRouteParam } from "../../utils/getRouteParam";
import { isValidUuid } from "../../utils/isValidUuid";
import { FRIEND_REQUEST_STATUS } from "@big2/friends-types";

export async function acceptFriendRequest(req: Request, res: Response): Promise<void> {
  const requestId = getRouteParam(req.params.requestId);

  if (!requestId) {
    res.status(400).json({ error: "request id must be 1 string only, not invalid or missing" });
    return;
  }
  if (!isValidUuid(requestId))
  {
    res.status(400).json({ error: "request id must not be a malformed uuid" });
    return;
  }
  
  // make sure incoming request exists in the database already, only then we responds with accepted
  const request = await drizzleFriendRequestRepository.findRequestId(requestId);
  if (!request)
  {
    res.status(404).end();
    return;
  }

  // irreversible: only a still-Pending request can be accepted
  if (request.status !== FRIEND_REQUEST_STATUS.PENDING) 
  {
    res.status(409).json({ error: `this request was already responded as ${request.status} — it can't be changed` });
    return;
  }

  await drizzleFriendRequestRepository.updateStatus(request.id, FRIEND_REQUEST_STATUS.ACCEPTED);

  if (!(await drizzleFriendshipRepository.areFriends(request.senderId, request.receiverId))) 
  {
    await drizzleFriendshipRepository.add(request.senderId, request.receiverId);
  }

  // if the other person had also sent a request the other way, close it too
  await drizzleFriendRequestRepository.updatePendingRequest(request.senderId, request.receiverId, FRIEND_REQUEST_STATUS.ACCEPTED);

  notify(request.senderId, EVENTS.FRIEND_REQUEST_ACCEPTED, { by: request.receiverId, requestId: request.id });
  notify(request.receiverId, EVENTS.FRIENDS_LIST_UPDATED, { newFriend: request.senderId });
  notify(request.senderId, EVENTS.FRIENDS_LIST_UPDATED, { newFriend: request.receiverId });

  res.json({ ...request, status: FRIEND_REQUEST_STATUS.ACCEPTED });
}
