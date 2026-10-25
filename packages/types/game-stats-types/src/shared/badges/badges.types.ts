// src/types/badges.types.ts: the combined list
import z from "zod";
import { PUBLIC_BADGE_IDS } from "./badges.public.types";
import { SECRET_BADGE_IDS } from "./badges.secret.types";

export const BADGE_IDS = [...PUBLIC_BADGE_IDS, ...SECRET_BADGE_IDS] as const;
export type BadgeId = (typeof BADGE_IDS)[number];

// true = unlocked, false = locked. 
// Secret badges are absent until unlocked, so partial.
export const BadgeUnlockStatusSchema = z.partialRecord(z.enum(BADGE_IDS), z.boolean());
export type BadgeUnlockStatus = z.infer<typeof BadgeUnlockStatusSchema>;