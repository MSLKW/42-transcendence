
function requireEnv(name: string): string
{
	const value = process.env[name];
	if (!value)
		throw new Error(`[Error] ${name} not set`);
	return value;
}

function requireEnvNum(name: string): number
{
	const value = Number(requireEnv(name));
	if (!Number.isInteger(value) || value < 0)
		throw new Error(`[Error] ${name} must be a non-negative integer`);
	return value;
}

export const PORT						= requireEnvNum("PORT");
export const AUTH_SERVICE_URL			= requireEnv("AUTH_SERVICE_URL");
export const GAME_BOT_SERVICE_URL		= requireEnv("GAME_BOT_SERVICE_URL");
export const GAME_STATS_SERVICE_URL		= requireEnv("GAME_STATS_SERVICE_URL");
export const LOBBY_LIMIT				= requireEnvNum("LOBBY_LIMIT");
export const LOBBY_USER_LIMIT			= requireEnvNum("LOBBY_USER_LIMIT");
export const LOBBY_DELETE_TIMEOUT_MS	= requireEnvNum("LOBBY_DELETE_TIMEOUT_MS");
