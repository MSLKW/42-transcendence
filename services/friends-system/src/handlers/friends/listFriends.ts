import type { Request, Response } from "express";
import { drizzleFriendshipStore } from "../../stores/drizzle/drizzleFriendshipStore";

export async function listFriends(req: Request, res: Response): Promise<void> {
  const uuid = req.query.uuid as string;
  res.json(await drizzleFriendshipStore.fullFriendList(uuid));
}
