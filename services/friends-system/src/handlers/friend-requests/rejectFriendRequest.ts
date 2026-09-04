import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";
import { getRouteParam } from "../../utils/getRouteParam";

export async function rejectFriendRequest(req: Request, res: Response): Promise<void> {
  const requestId = getRouteParam(req.params.id);
  if (!requestId) {
    res.status(400).json({ error: "invalid request id" });
    return;
  }

  const request = await drizzleFriendRequestRepository.findRequestId(requestId);
  if (!request) {
    res.status(404).end();
    return;
  }

  if (request.status !== "Pending") {
    res.status(409).json({ error: `this request was already ${request.status} — it can't be changed` });
    return;
  }

  await drizzleFriendRequestRepository.updateStatus(request.id, "Rejected");
  notify(request.senderId, EVENTS.FRIEND_REQUEST_REJECTED, { by: request.receiverId, requestId: request.id });
  res.json({ ...request, status: "Rejected" });
}
