import type { Request, Response } from "express";
import { drizzleFriendshipRepository } from "../../repositories/drizzle/DrizzleFriendshipRepository";

export async function listFriends(req: Request, res: Response): Promise<void> {
  const uuid = req.query.uuid as string;
  res.json(await drizzleFriendshipRepository.fullFriendList(uuid));
}
