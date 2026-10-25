import fs from "fs";


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

export const PORT 					= requireEnvNum("PORT");
export const AUTH_SERVICE_URL		= requireEnv("AUTH_SERVICE_URL");
export const PROFILE_SERVICE_URL	= requireEnv("PROFILE_SERVICE_URL");
export const FRIENDS_SERVICE_URL	= requireEnv("FRIENDS_SERVICE_URL");

// TODO (game-server): need to do these below exactly the same in their env.ts too
export const STATISTICS_TOKEN_FILE	= requireEnv("STATISTICS_TOKEN_FILE");
export const STATISTICS_TOKEN	= fs.readFileSync(STATISTICS_TOKEN_FILE, 'utf-8').trim();	// readFileSync throws ENOENT and names the path, if doesn't exist
if (!STATISTICS_TOKEN)
  throw new Error(`[Error] password file ${STATISTICS_TOKEN_FILE} is empty`); 					// throw if empty or only whitespace
