import { z } from "zod";

const requireOneFieldMinimum = (obj: any) => Object.values(obj).some((v) => v !== undefined);
const oneFieldMinimumFailed = { message: "At least one field must be provided", path: [] };

export const UserDataSchema = z.object({
	username:	z.string().nullable().optional(),
	avatarPath:	z.string().nullable().optional()
})
.refine(
	requireOneFieldMinimum,
	oneFieldMinimumFailed
);

export const UserGameSettingsSchema = z.object({
	allow3OfAKind:		z.boolean().optional(),
	allow2OfSpadesEnd:	z.boolean().optional(),
	autoPassTimerMs:	z.number().int().min(0).max(0).optional(),
	cardStyle:			z.number().int().min(0).max(0).optional(),
	uiColour:			z.number().int().min(0).max(0).optional(),
	fxLevel:			z.number().int().min(0).max(100).optional(),
	mxLevel:			z.number().int().min(0).max(100).optional()
})
.refine(
	requireOneFieldMinimum,
	oneFieldMinimumFailed
);
