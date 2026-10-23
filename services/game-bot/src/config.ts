import "dotenv/config";

export const PORT = Number(process.env.PORT);
export const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL as string;
export const BOT_LOG_DIR = process.env.BOT_LOG_DIR as string;
export const BOT_LOG_LEVEL = process.env.BOT_LOG_LEVEL as string;
export const BOT_MOVE_DELAY_MIN = Number(process.env.BOT_MOVE_DELAY_MIN) || 0.1;
export const BOT_MOVE_DELAY_MAX = Number(process.env.BOT_MOVE_DELAY_MAX) || 0.375;

if (!PORT)
	throw new Error("PORT not set"); 

if (!GAME_SERVICE_URL)
	throw new Error("GAME_SERVICE_URL not set");

if (!BOT_LOG_DIR)
	throw new Error("BOT_LOG_DIR not set");

if (!BOT_LOG_LEVEL)
	throw new Error("BOT_LOG_LEVEL not set")

if (BOT_MOVE_DELAY_MIN < 0 || BOT_MOVE_DELAY_MIN > 1)
	throw new Error("BOT_MOVE_DELAY_MIN must be between 0-1");
if (BOT_MOVE_DELAY_MAX < 0 || BOT_MOVE_DELAY_MAX > 1)
	throw new Error("BOT_MOVE_DELAY_MAX must be between 0-1");
if (BOT_MOVE_DELAY_MIN > BOT_MOVE_DELAY_MAX)
	throw new Error("BOT_MOVE_DELAY_MIN must be less than or equal to BOT_MOVE_DELAY_MAX");