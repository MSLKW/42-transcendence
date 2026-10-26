import { type BadgeId } from "@big2/game-stats-types/game-stats"
import { checkBotUsername, checkSpecialAvatar } from "./verifiers/verifyProfile";
import { checkFriendCount } from "./verifiers/verifyFriends";


// 1. egg types
type Egg = { 
	badgeId: BadgeId; 
	verify?: (playerUuid: string) => Promise<boolean> 
};


// 2. lookup table
// id namings are opaque on purpose, generated in the terminal:
// 		for i in 1 2 3 4; do echo "egg_$(openssl rand -hex 6)"; done
// opaque = means a name you can’t understand by looking at it; reveals nothing about what it stands for
// the website ships them, so they must not hint clients at the trigger
export const EASTER_EGGS: Record<string, Egg> = {
	egg_f355a785db3c: { badgeId: "curious_cat" },									// hidden button in the privacy policy (full trust on website for this easter egg)
	egg_b31524145402: { badgeId: "imposter",         verify: checkBotUsername },	// username with "bot-" prefix (profile)
	egg_0a793011efa2: { badgeId: "social_butterfly", verify: checkFriendCount },	// 42 friends (friends)
	egg_5640cd1ea99b: { badgeId: "connoisseur",      verify: checkSpecialAvatar },	// special avatar (profile)
};
