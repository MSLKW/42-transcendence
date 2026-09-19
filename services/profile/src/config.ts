export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const AVATAR_DIR = process.env.AVATAR_DIR || "./data/avatars";

if (!AUTH_SERVICE_URL)
	console.error("[Error] AUTH_SERVICE_URL not set");
