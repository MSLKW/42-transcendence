import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";
import { getRouteParam } from "../../utils/getRouteParam";
import { isValidUuid } from "../../utils/isValidUuid";
import { FRIEND_REQUEST_STATUS } from "@big2/friends-types";

export async function rejectFriendRequest(req: Request, res: Response): Promise<void> 
{
  const requestId = getRouteParam(req.params.requestId);

  if (!requestId) 
  {
    res.status(400).json({ error: "requestId must be 1 string only, not invalid or missing" });
    return;
  }
  if (!isValidUuid(requestId))
  {
    res.status(400).json({ error: "requestId must not be a malformed uuid" });
    return;
  }

  const request = await drizzleFriendRequestRepository.findRequestId(requestId);
  if (!request) {
    res.status(404).end();
    return;
  }

  if (request.status !== FRIEND_REQUEST_STATUS.PENDING) {
    res.status(409).json({ error: `this request was already responded as ${request.status} — it can't be changed` });
    return;
  }

  await drizzleFriendRequestRepository.updateStatus(request.id, FRIEND_REQUEST_STATUS.REJECTED);
  notify(request.senderId, EVENTS.FRIEND_REQUEST_REJECTED, { by: request.receiverId, requestId: request.id });
  res.json({ ...request, status: FRIEND_REQUEST_STATUS.REJECTED });
}
