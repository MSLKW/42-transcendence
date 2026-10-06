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
export const AUTH_SERVICE_URL = requireEnv("AUTH_SERVICE_URL");
export const SOCKET_CHAT_PATH = requireEnv("SOCKET_CHAT_PATH");