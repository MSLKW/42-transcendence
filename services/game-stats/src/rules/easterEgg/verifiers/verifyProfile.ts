import z from "zod";
import { PROFILE_SERVICE_URL } from "../../../config/env";
import { hasBotPrefix } from "../../../utils/botIdentifier";


// 1. setup rules' values & schemas for PROFILE
const SPECIAL_AVATAR_PATH = "avatar-animal-3.webp";		// TODO: determine which avatar filename is to be awarded with badge
const ProfileSchema = z.object({
	username: z.string().nullable(),
	avatarPath: z.string().nullable(),
});


// 2. fetches
async function fetchProfile(playerUuid: string)
{
	const res = await fetch(`${PROFILE_SERVICE_URL}/profile/${playerUuid}`, {
		signal: AbortSignal.timeout(3000),
	});
	if (!res.ok)
		throw new Error(`profile responded ${res.status}`);
	return (ProfileSchema.parse(await res.json()));
}


// 3. checks
// both username & avatarPath are nullable, reject nulls upfront
export async function checkBotUsername(playerUuid: string): Promise<boolean>
{
	const { username } = await fetchProfile(playerUuid);
	return (username !== null && hasBotPrefix(username));
}

export async function checkSpecialAvatar(playerUuid: string): Promise<boolean>
{
	const { avatarPath } = await fetchProfile(playerUuid);
	return (avatarPath === SPECIAL_AVATAR_PATH);
}
