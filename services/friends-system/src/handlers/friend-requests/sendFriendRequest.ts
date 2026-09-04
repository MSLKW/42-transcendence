import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";
import { drizzleFriendshipRepository } from "../../repositories/drizzle/DrizzleFriendshipRepository";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";

export async function sendFriendRequest(req: Request, res: Response): Promise<void> {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId || typeof receiverId !== "string" || receiverId.trim() === "") {
    res.status(400).json({ error: "a valid receiver uuid is required" });
    return;
  }
  if (senderId === receiverId) {
    res.status(400).json({ error: "cannot friend yourself" });
    return;
  }

  // TODO: Check if receiverId exists in Postgres (auth-schema's users table)

  if (await drizzleFriendshipRepository.areFriends(senderId, receiverId)) {
    res.status(409).json({ error: "already friends" });
    return;
  }

  const existingSameDirection = await drizzleFriendRequestRepository.findPendingBothSides(senderId, receiverId);
  if (existingSameDirection) {
    res.status(409).json({ error: "request already pending" });
    return;
  }

  const reverseRequest = await drizzleFriendRequestRepository.findPendingBothSidesReverseCheck(senderId, receiverId);
  if (reverseRequest) {
    res.status(409).json({
      error: "they already sent you a request — respond to it instead",
      requestId: reverseRequest.id,
    });
    return;
  }

  const request = await drizzleFriendRequestRepository.sendRequest(senderId, receiverId);
  notify(receiverId, EVENTS.FRIEND_REQUEST_RECEIVED, request);
  res.status(201).json(request);
}
