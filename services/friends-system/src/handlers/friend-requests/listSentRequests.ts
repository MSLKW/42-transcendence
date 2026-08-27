import type { Request, Response } from "express";
import { friendRequests } from "../../data/memoryFriendData";

export function listSentRequests(req: Request, res: Response): void {
  const uuid = req.query.uuid as string;
  res.json(friendRequests.filter(r => r.senderId === uuid));
}
