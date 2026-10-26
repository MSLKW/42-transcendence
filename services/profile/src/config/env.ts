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

export const PORT				= requireEnvNum("PORT");
export const AUTH_SERVICE_URL	= requireEnv("AUTH_SERVICE_URL");
export const AVATAR_DIR			= requireEnv("AVATAR_DIR");