import type { Request, Response } from "express";
import { drizzleFriendRequestStore } from "../../stores/drizzle/drizzleFriendRequestStore";

export async function listReceivedRequests(req: Request, res: Response): Promise<void> {
  const uuid = req.query.uuid as string;
  res.json(await drizzleFriendRequestStore.listRecievedAndPending(uuid));
}
