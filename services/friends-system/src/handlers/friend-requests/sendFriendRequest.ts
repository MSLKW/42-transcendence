import type { Request, Response } from "express";
import crypto from "crypto";
import { drizzleFriendRequestStore } from "../../stores/drizzle/drizzleFriendRequestStore";
import { notify } from "../../events/notify";
import { EVENTS } from "../../events/eventNames";

export function sendFriendRequest(req: Request, res: Response): void {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId || typeof receiverId !== "string" || receiverId.trim() === "") {
    res.status(400).json({ error: "a valid receiver uuid is required" });
    return;
  }
  if (senderId === receiverId) {
    res.status(400).json({ error: "cannot friend yourself" });
    return;
  }

  // TODO: Check if friendUUID exists in Postgres
  // const receiverExists = await .......
  // if (!receiverExists) return res.status(404).json({ error: "no such user" });

  if (areFriends(senderId, receiverId)) {
    res.status(409).json({ error: "already friends" });
    return;
  }

  const existingSameDirection = friendRequests.find(
    r => r.senderId === senderId && r.receiverId === receiverId && r.status === "Pending"
  );
  if (existingSameDirection) {
    res.status(409).json({ error: "request already pending" });
    return;
  }

  const reverseRequest = friendRequests.find(
    r => r.senderId === receiverId && r.receiverId === senderId && r.status === "Pending"
  );
  if (reverseRequest) {
    res.status(409).json({
      error: "they already sent you a request — respond to it instead",
      requestId: reverseRequest.id,
    });
    return;
  }

  const request: FriendRequest = {
    id: crypto.randomUUID(),
    senderId,
    receiverId,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  friendRequests.push(request);
  notify(receiverId, EVENTS.FRIEND_REQUEST_RECEIVED, request);
  res.status(201).json(request);
}
