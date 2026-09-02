// Temporary in-memory data, same shape/behavior as the original index.ts —
// this file is a placeholder ONLY. It is not the real store/ layer; that's
// being written separately with real Drizzle classes. Delete this file
// entirely once those are wired in, and update the imports in handlers/
// to point at the real store instead.
import { pairKey } from "../utils/pairKey";

export type Status = "Pending" | "Accepted" | "Rejected";

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: Status;
  createdAt: string;
}

export const friendRequests: FriendRequest[] = [];
export const friendships: { a: string; b: string }[] = [];

export function areFriends(a: string, b: string): boolean {
  return friendships.some(f => pairKey(f.a, f.b) === pairKey(a, b));
}