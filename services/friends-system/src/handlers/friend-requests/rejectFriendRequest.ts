import type { Request, Response } from "express";
import { friendRequests } from "../../store/memoryFriendData";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";

export function rejectFriendRequest(req: Request, res: Response): void {
  const request = friendRequests.find(r => r.id === req.params.id);
  if (!request) {
    res.status(404).end();
    return;
  }

  // irreversible: only a still-pending request can be rejected
  if (request.status !== "Pending") {
    res.status(409).json({ error: `this request was already ${request.status} — it can't be changed` });
    return;
  }

  request.status = "Rejected";
  notify(request.senderId, EVENTS.FRIEND_REQUEST_REJECTED, { by: request.receiverId, requestId: request.id });
  res.json(request);
}
