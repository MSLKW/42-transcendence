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

  // no need to manuall check if uuid exists for making friendrequests
  // WHY? coz in database, its already Foreign Key-ed to authentication service
  // who owns and creates all the uuid existed in the database anyway
  // FK Speciality, it will THROW FK violation error in such cases the uuid thats FK-ed dosent exists.
  // so, no more pre-manual check from friends-system to authentication using internal REST APIs needed
  // before makinge each friend requests
  // it is already enforced in database level through Foreign Key constraints 
  try
  {
    const request = await drizzleFriendRequestRepository.sendRequest(senderId, receiverId);
    notify(receiverId, EVENTS.FRIEND_REQUEST_RECEIVED, request);
    res.status(201).json(request);
  }
  catch (err: any) 
  {
    // Postgres error code 23503 = foreign_key_violation
    // this is what was thrown and fired when receiverId doesn't exist in auth_schema.users.
    if (err.code === "23503") 
    {
      res.status(404).json({ error: "receiverId does not exist" });
      return;
    }

    // anything else is a real, unexpected error => let it surface
    throw err; 
  }
}
