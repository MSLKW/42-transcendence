import "dotenv/config";

export const BOT_LOG_LEVEL = process.env.BOT_LOG_LEVEL as string;
if (!BOT_LOG_LEVEL)
	throw new Error("BOT_LOG_LEVEL not set")

export interface AppConfig {
	serverUrl: string;
	botCount: number;
	idOffset: number;
}

export const config: AppConfig = {
	serverUrl: process.env.SERVER_URL || "http://localhost:3000",
	botCount: parseInt(process.env.BOT_COUNT || "1", 10),
	idOffset: parseInt(process.env.BOT_ID_OFFSET || "0", 10),
};
