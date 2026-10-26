import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";
import { drizzleFriendshipRepository } from "../../repositories/drizzle/DrizzleFriendshipRepository";
import { notify } from "../../events/notify";
import { EVENTS } from "@big2/friends-types";
import { isValidUuid } from "../../utils/isValidUuid";
import { getRouteParam } from "../../utils/getRouteParam";


export async function sendFriendRequest(req: Request, res: Response): Promise<void> {
  // currently senderId/receiverId are typed any since they come off req.body, before getRouteParam
  const senderId = getRouteParam(req.body.senderId);
  const receiverId = getRouteParam(req.body.receiverId);

  // uuids are not empty or array
  if (!senderId)
  {
    res.status(400).json({ error: "senderId must be 1 string only, not invalid or missing" });
    return;
  }
  if (!receiverId)
  {
    res.status(400).json({ error: "receiverId must be 1 string only, not invalid or missing" });
    return;
  }

  // Malformed UUIDs throws (SQLSTATE 22P02) by Postgres at earlier stage than 23503 FK violation
  if (!isValidUuid(senderId)) 
  {
    res.status(400).json({ error: "senderId must not be a malformed uuid" });
    return;
  }
  if (!isValidUuid(receiverId)) 
  {
    res.status(400).json({ error: "receiverId must not be a malformed uuid" });
    return;
  }

  // befriending urself is not allowed
  if (senderId === receiverId) {
    res.status(400).json({ error: "cannot friend yourself" });
    return;
  }

  // resend request to existing friends
  if (await drizzleFriendshipRepository.areFriends(senderId, receiverId)) {
    res.status(409).json({ error: "already friends" });
    return;
  }

  // application layer guard: avoid >1 dupe pending requests at a time
  // database layer guard: unique index constraints for safety net in case of race conditions
  //
  // with specified error logs that similar request has been sent already, previously 
  const existingSameDirection = await drizzleFriendRequestRepository.findPendingBothSides(senderId, receiverId);
  if (existingSameDirection) {
    res.status(409).json({ error: "request already pending" });
    return;
  }
  // with specified error logs to respond to received request instead
  const reverseRequest = await drizzleFriendRequestRepository.findPendingBothSidesReverseCheck(senderId, receiverId);
  if (reverseRequest) {
    res.status(409).json({
      error: "they already sent you a request — respond to it instead",
      requestId: reverseRequest.id,
    });
    return;
  }

  // no need to do manual check if uuid exists via internal REST API to auth service before making friendrequests
  // WHY? coz in database, its already enforced by Postgres's Foreign Key constraint linked to authentication service
  // who owns and creates all the uuid existed in the database anyway
  // in querying, we attempt the write, 
  // then translate whatever Postgres error code comes back into a specific, useful response.
  try
  {
    const request = await drizzleFriendRequestRepository.sendRequest(senderId, receiverId);
    notify(receiverId, EVENTS.FRIEND_REQUEST_RECEIVED, request);
    res.status(201).json(request);
  }
  catch (err: any) 
  {
    // 1. invalid_text_representation
    // malformed uuid
    if (err.code === "22P02")
    {
      res.status(400).json({ error: "malformed uuid rejected by the database" });
      return;
    }

    // 2. Postgres error code 23503 = foreign_key_violation
    // this is what was thrown and fired when receiverId doesn't exist in auth_schema.users.
    if (err.code === "23503") 
    {
      res.status(404).json({ error: "receiver id does not exist" });
      return;
    }

    // 3. Postgres error code 23505 = unique_violation 
    // 409 -> conflict status code
    // this is what was thrown and fired when receiverId doesn't exist in auth_schema.users.
    if (err.code === "23505") 
    {
      res.status(409).json({ error: "this request already exists" });
      return;
    }

    // 4. anything else: real, unexpected error. let it surface
    console.error("Unexpected error in sendFriendRequest:", err);
    res.status(500).json({ error: "something went wrong in sending the friend request" });
    return; 
  }
}
