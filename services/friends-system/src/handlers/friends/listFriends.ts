import type { Request, Response } from "express";
import { friendships } from "../../store/memoryFriendData";

export function listFriends(req: Request, res: Response): void {
  const uuid = req.query.uuid as string;
  const friends = friendships
    .filter(f => f.a === uuid || f.b === uuid)
    .map(f => (f.a === uuid ? f.b : f.a));
  res.json(friends);
}
