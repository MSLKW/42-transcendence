function requireEnv(name: string): string
{
	const value = process.env[name];
	if (!value)
		throw new Error(`[Error] ${name} not set`);
	return value;
}

export const PORT = requireEnv("PORT");
