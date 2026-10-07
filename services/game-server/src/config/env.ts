function requireEnv(name: string): string
{
	const value = process.env[name];
	if (!value)
		throw new Error(`[Error] ${name} not set`);
	return value;
}

export const AUTH_SERVICE_URL	= requireEnv("AUTH_SERVICE_URL");
