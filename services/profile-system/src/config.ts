export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const GAME_STATS_SERVICE_URL = process.env.GAME_STATS_SERVICE_URL;
export const PARTY_MANAGER_SERVICE_URL = process.env.PARTY_MANAGER_SERVICE_URL;
export const AVATAR_DIR = process.env.AVATAR_DIR || "./data/avatars";

if (!AUTH_SERVICE_URL)
	console.error("[Error] AUTH_SERVICE_URL not set");

if (!GAME_STATS_SERVICE_URL)
	console.error("[Error] GAME_STATS_SERVICE_URL not set");

if (!PARTY_MANAGER_SERVICE_URL)
	console.error("[Error] PARTY_MANAGER_SERVICE_URL not set");