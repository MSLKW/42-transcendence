export const PORT = process.env.PORT;
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const AVATAR_DIR = process.env.AVATAR_DIR;

if (!PORT) 				throw new Error("[Error] PORT not set");
if (!AUTH_SERVICE_URL) 	throw new Error("[Error] AUTH_SERVICE_URL not set");
if (!AVATAR_DIR) 		throw new Error("[Error] AVATAR_DIR not set");
