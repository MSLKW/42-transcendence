import { type BadgeId } from "@big2/game-stats-types";
import z from "zod";
import { PROFILE_SERVICE_URL, FRIENDS_SERVICE_URL } from "../config/env";
import { hasBotPrefix } from "../utils/botIdentifier";


// 1. easter egg rules
type Egg = { 
	badgeId: BadgeId; 
	verify?: (playerUuid: string) => Promise<boolean> 
};

// id namings are opaque on purpose
// the website ships them, so they must not hint clients at the trigger
export const EASTER_EGGS: Record<string, Egg> = {
	egg_01: { badgeId: "curious_cat" },										// hidden button in the privacy policy (unverifiable)
	egg_02: { badgeId: "imposter",         verify: checkBotUsername },		// username with "bot-" prefix (profile)
	egg_03: { badgeId: "social_butterfly", verify: checkFriendCount },		// 42 friends (friends)
	egg_04: { badgeId: "connoisseur",      verify: checkSpecialAvatar },	// special avatar (profile)
};


// 2. values set needed for the rule
const SPECIAL_AVATAR_PATH = "...";		// TODO: determine which avatar filename is to be awarded with badge
const FRIEND_GOAL = 42;


// 3. return values schema from fetches
const ProfileSchema = z.object({
	username: z.string(),
	avatarPath: z.string(),
});

const FriendshipListSchema = z.array(z.uuid());


// 4. fetches and checks
async function fetchProfile(playerUuid: string)
{
	const res = await fetch(`${PROFILE_SERVICE_URL}/profile/${playerUuid}`, {
		signal: AbortSignal.timeout(3000),
	});
	if (!res.ok)
		throw new Error(`profile responded ${res.status}`);
	return (ProfileSchema.parse(await res.json()));
}

export async function checkBotUsername(playerUuid: string): Promise<boolean>
{
	return (hasBotPrefix((await fetchProfile(playerUuid)).username));
}

export async function checkSpecialAvatar(playerUuid: string): Promise<boolean>
{
	return ((await fetchProfile(playerUuid)).avatarPath === SPECIAL_AVATAR_PATH);
}


export async function checkFriendCount(playerUuid: string): Promise<boolean>
{
	const res = await fetch(`${FRIENDS_SERVICE_URL}/friendships/${playerUuid}`, {
		signal: AbortSignal.timeout(3000),
	});
	if (!res.ok)
		throw new Error(`friends responded ${res.status}`);

	const friends = FriendshipListSchema.parse(await res.json());
	return (friends.length >= FRIEND_GOAL);
}
