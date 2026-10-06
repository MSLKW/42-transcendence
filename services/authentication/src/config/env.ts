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

export const PORT = requireEnvNum("PORT");
export const PROFILE_SERVICE_URL = requireEnv("PROFILE_SERVICE_URL");
export const SESSION_CLEANUP_CRON_SCHEDULE_STRING = requireEnv("SESSION_CLEANUP_CRON_SCHEDULE_STRING");

// * the values below defined in sessionConfig.ts instead
// export const SESSION_DURATION_MS = requireEnv("SESSION_DURATION_MS");
