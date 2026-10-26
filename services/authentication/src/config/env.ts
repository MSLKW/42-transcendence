const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function requireEnv(name: string): string
{
	const value = process.env[name];
	if (!value)
		throw new Error(`${RED}[Error] ${name} not set${RESET}`);
	return value;
}

function requireEnvNum(name: string): number
{
	try
	{
		const value = Number(eval(requireEnv(name)));
		if (!Number.isInteger(value) || value < 0)
			throw new Error(`${RED}[Error] ${name} must be a non-negative integer${RESET}`);
		return value;
	}
	catch (err)
	{
		throw new Error(`${RED}[Error] ${name} contains invalid characters`);
	}
}

process.on("uncaughtException", (err: Error) => {
	console.error(err.message);
	process.exit(1);
});

export const PORT									= requireEnvNum("PORT");
export const SESSION_DURATION_MS					= requireEnvNum("SESSION_DURATION_MS")
export const PROFILE_SERVICE_URL					= requireEnv("PROFILE_SERVICE_URL");
export const SESSION_CLEANUP_CRON_SCHEDULE_STRING	= requireEnv("SESSION_CLEANUP_CRON_SCHEDULE_STRING")