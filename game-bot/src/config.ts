import "dotenv/config";

export const PORT = Number(process.env.PORT) || 3000;
export const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL as string;
export const BOT_LOG_DIR = process.env.BOT_LOG_DIR as string;
export const BOT_LOG_LEVEL = process.env.BOT_LOG_LEVEL as string;

if (!PORT)
	throw new Error("PORT not set"); 

if (!GAME_SERVICE_URL)
	throw new Error("GAME_SERVICE_URL not set");

if (!BOT_LOG_DIR)
	throw new Error("BOT_LOG_DIR not set");

if (!BOT_LOG_LEVEL)
	throw new Error("BOT_LOG_LEVEL not set")