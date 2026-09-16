import { Request, Response } from "express";
import { UserStore } from "../store/UserStore";
import { fetchJson } from "../utils/fetchJson";
import { AUTH_SERVICE_URL, 
		 GAME_STATS_SERVICE_URL, 
		 PARTY_MANAGER_SERVICE_URL } from "../config";

if (!AUTH_SERVICE_URL)
	throw new Error("[Error] AUTH_SERVICE_URL not set");

if (!PARTY_MANAGER_SERVICE_URL)
	throw new Error("[Error] PARTY_MANAGER_SERVICE_URL is not set");

// // commented as game-stats is not yet built, as for now. 
// // handled below by the temporary ternary instead
// if (!GAME_STATS_SERVICE_URL)
// 	throw new Error("[Error] GAME_STATS_SERVICE_URL is not set");

const DEFAULT_GAME_STATS_DATA = {
	level: 0,
	xp: 0,
	totalPlayed: 0,
	totalWins: 0,
	totalLoss: 0,
	winStreak: 0,
};


export function getUserProfile(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		const userData = await store.getUserData(uuid);
		if (!userData)
			return (res.status(404).json({error: `uuid <${uuid}> not found`}));

		try
		{
			const [authData, partyData, gameStatsData] = await Promise.all ([
				fetchJson(`${AUTH_SERVICE_URL}/internal/profile/infos/${uuid}`),
				fetchJson(`${PARTY_MANAGER_SERVICE_URL}/online/${uuid}`),
				GAME_STATS_SERVICE_URL 
					? 
					fetchJson(`${GAME_STATS_SERVICE_URL}/internal/profile/${uuid}`).catch(() => DEFAULT_GAME_STATS_DATA)
					:
					Promise.resolve(DEFAULT_GAME_STATS_DATA),
			]);

			return (res.status(200).json({
				...userData,
				createdAt: authData.createdAt,
				lastLogin: authData.lastLogin,
				level: gameStatsData.level,
				xp: gameStatsData.xp,
				totalPlayed: gameStatsData.totalPlayed,
				totalWins: gameStatsData.totalWins,
				totalLoss: gameStatsData.totalLoss,
				winStreak: gameStatsData.winStreak,
				online: partyData.online,
				inGame: partyData.inGame,
			}));
		}
		catch (err: any)
		{
			console.error("Failed to aggregate user profile", err);
			return (res.status(502).json({ error: "Failed to fetch profile data from an upstream service" }));
		}
	});
}
