// TODO: remove DOMAIN_PORT in production. comment: Right now only for vite config, can remove in production
export const DOMAIN_PORT = import.meta.env.DOMAIN_PORT;
if (!DOMAIN_PORT)
	throw new Error("[Error] DOMAIN_PORT not set");

export const VITE_API_AUTH_PATH = import.meta.env.VITE_API_AUTH_PATH;
export const VITE_API_PROFILE_PATH = import.meta.env.VITE_API_PROFILE_PATH;
export const VITE_API_PARTY_PATH = import.meta.env.VITE_API_PARTY_PATH;
export const VITE_API_FRIENDS_PATH = import.meta.env.VITE_API_FRIENDS_PATH;
export const VITE_API_GAME_STATS_PATH = import.meta.env.VITE_API_GAME_STATS_PATH;
export const VITE_SOCKET_CHAT_PATH = import.meta.env.VITE_SOCKET_CHAT_PATH;
export const VITE_SOCKET_PARTY_PATH = import.meta.env.VITE_SOCKET_PARTY_PATH;
export const VITE_SOCKET_GAME_SERVER_PATH = import.meta.env.VITE_SOCKET_GAME_SERVER_PATH;
export const VITE_SOCKET_GAME_BOT_PATH = import.meta.env.VITE_SOCKET_GAME_BOT_PATH;
export const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

if (!VITE_API_AUTH_PATH) 			throw new Error("[Error] VITE_API_AUTH_PATH not set");
if (!VITE_API_PROFILE_PATH) 		throw new Error("[Error] VITE_API_PROFILE_PATH not set");
if (!VITE_API_PARTY_PATH) 			throw new Error("[Error] VITE_API_PARTY_PATH not set");
if (!VITE_API_FRIENDS_PATH) 		throw new Error("[Error] VITE_API_FRIENDS_PATH not set");
if (!VITE_API_GAME_STATS_PATH) 		throw new Error("[Error] VITE_API_GAME_STATS_PATH not set");
if (!VITE_SOCKET_CHAT_PATH) 		throw new Error("[Error] VITE_SOCKET_CHAT_PATH not set");
if (!VITE_SOCKET_PARTY_PATH)	 	throw new Error("[Error] VITE_SOCKET_PARTY_PATH not set");
if (!VITE_SOCKET_GAME_SERVER_PATH)	throw new Error("[Error] VITE_SOCKET_GAME_SERVER_PATH not set");
if (!VITE_SOCKET_GAME_BOT_PATH)	 	throw new Error("[Error] VITE_SOCKET_GAME_BOT_PATH not set");
if (!VITE_SOCKET_URL) 				throw new Error("[Error] VITE_SOCKET_URL not set");
