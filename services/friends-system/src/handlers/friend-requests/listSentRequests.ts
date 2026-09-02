import type { Request, Response } from "express";
import { drizzleFriendRequestStore } from "../../stores/drizzleFriendRequestStore";

export function listSentRequests(req: Request, res: Response): void {
  const uuid = req.query.uuid as string;
  res.json(friendRequests.filter(r => r.senderId === uuid));
}
