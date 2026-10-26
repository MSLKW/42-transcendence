import fs from 'fs';


// 1. Load the .env file and check the environment vars are properly set
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

const PGPASSWORD_FILE 		= requireEnv("PGPASSWORD_FILE");  // throws if not set or empty in compose
export const PGUSER			= requireEnv("PGUSER");
export const PGPORT         = requireEnvNum("PGPORT");
export const PGHOST         = requireEnv("PGHOST");
export const PGDATABASE     = requireEnv("PGDATABASE");
export const PG_POOL_MAX    = requireEnvNum("PG_POOL_MAX");

export const PGPASSWORD = fs.readFileSync(PGPASSWORD_FILE, 'utf-8').trim();    // readFileSync throws ENOENT and names the path, if doesn't exist	
if (!PGPASSWORD) 
  throw new Error(`[Error] password file ${PGPASSWORD_FILE} is empty`); // throw if empty or only whitespace
