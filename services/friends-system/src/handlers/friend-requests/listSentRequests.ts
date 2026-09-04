import type { Request, Response } from "express";
import { drizzleFriendRequestRepository } from "../../repositories/drizzle/DrizzleFriendRequestRepository";

export async function listSentRequests(req: Request, res: Response): Promise<void> {
  const uuid = req.query.uuid as string;
  res.json(await drizzleFriendRequestRepository.listSent(uuid));
}
