import "dotenv/config";
import { postgres } from "./postgres";
import { userProfile } from "@big2/profile-system-schema";
import { eq } from "drizzle-orm";
import type { UserData } from "@big2/profile-system-types";


const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL;
if (!GAME_SERVICE_URL)
	throw new Error("GAME_SERVICE_URL is not set");

const PARTY_MANAGER_SERVICE_URL = process.env.PARTY_MANAGER_SERVICE_URL;
if (!PARTY_MANAGER_SERVICE_URL)
	throw new Error("PARTY_MANAGER_SERVICE_URL is not set");


async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) 
	throw new Error(`Request to ${url} failed with ${res.status}`);
  return res.json();
}


export class DrizzleUserProfileStore {

	//TODO: get user data from Postgres with uuid => getProfile()
	async getFullCompletedProfile(id: string): Promise<UserData | null> {
		// 1. one query, within our own schema, via the view => named to (profile)
		const [profile] = await postgres
			.select()
			.from(userProfile)
			.where(eq(userProfile.id, id));
		if (!profile) 
			return null; // no user_info row for this id at all


		// 2. REST calls to the services that own the rest, in parallel => named to authData, gameData, partyData
		const [authData, gameData, partyData] = await Promise.all([
			fetchJson(`${AUTH_SERVICE_URL}/internal/profile/${id}`),
			fetchJson(`${GAME_SERVICE_URL}/internal/profile/${id}`),
			fetchJson(`${PARTY_MANAGER_SERVICE_URL}/internal/profile/${id}`),
		]);


    	// 3. the view is flat — UserSettings needs to be nested to match UserData, possible through ???? as this return is in ?????
		return {
			id: profile.id,
			username: profile.username,
			avatarPath: profile.avatarPath,
			badge: profile.badge,
			achievements: profile.achievements,
			userSettings: {
				allow3OfAKind: profile.allow3OfAKind,
				allow2OfSpadesEnd: profile.allow2OfSpadesEnd,
				autoPassIndex: profile.autoPassIndex,
				endGameCondition: profile.endGameCondition,
				scoreCalculation: profile.scoreCalculation,
				cardStyle: profile.cardStyle,
				uiColor: profile.uiColor,
				fxLevel: profile.fxLevel,
				mxLevel: profile.mxLevel,
			},
			createdAt: authData.createdAt,
			lastLogin: authData.lastLogin,
			level: gameData.level,
			xp: gameData.xp,
			totalPlayed: gameData.totalPlayed,
			totalWins: gameData.totalWins,
			totalLoss: gameData.totalLoss,
			winStreak: gameData.winStreak,
			online: partyData.online,
			inGame: partyData.inGame,
		};
	}
}

// (Kept the REST error-handling to "throw and let the route's try/catch report a 500" — fine for MVP; real retry/timeout handling is a later concern, not blocking you now.)