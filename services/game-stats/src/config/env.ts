// export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export const PORT = 3000;

export const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL;
if (!GAME_SERVICE_URL)
	console.error("[Error] GAME_SERVICE_URL not set");