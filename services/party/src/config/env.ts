export const PORT = process.env.PORT;
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const GAME_SERVER_SERVICE_URL = process.env.GAME_SERVER_SERVICE_URL;

if (!PORT) 						throw new Error("[Error] PORT not set");
if (!AUTH_SERVICE_URL) 			throw new Error("[Error] AUTH_SERVICE_URL not set");
if (!GAME_SERVER_SERVICE_URL)	throw new Error("[Error] GAME_SERVER_SERVICE_URL not set");
