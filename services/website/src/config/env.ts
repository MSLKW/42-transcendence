// runs in, where?	: browser
// error thrown, when?	: When the first file importing env.ts is loaded, i.e. page load
// error thrown, where?	: Browser Console; nothing in the Docker logs
function requireEnv(name: string, value: string | undefined): string
{
	if (!value)
		throw new Error(`[Error] ${name} not set`);
	return value;
}

export const VITE_API_AUTH_PATH 			= requireEnv("VITE_API_AUTH_PATH", import.meta.env.VITE_API_AUTH_PATH);
export const VITE_API_PROFILE_PATH 			= requireEnv("VITE_API_PROFILE_PATH", import.meta.env.VITE_API_PROFILE_PATH);
export const VITE_API_PARTY_PATH 			= requireEnv("VITE_API_PARTY_PATH", import.meta.env.VITE_API_PARTY_PATH);
export const VITE_API_FRIENDS_PATH 			= requireEnv("VITE_API_FRIENDS_PATH", import.meta.env.VITE_API_FRIENDS_PATH);
export const VITE_API_GAME_STATS_PATH 		= requireEnv("VITE_API_GAME_STATS_PATH", import.meta.env.VITE_API_GAME_STATS_PATH);
export const VITE_SOCKET_CHAT_PATH 			= requireEnv("VITE_SOCKET_CHAT_PATH", import.meta.env.VITE_SOCKET_CHAT_PATH);
export const VITE_SOCKET_PARTY_PATH 		= requireEnv("VITE_SOCKET_PARTY_PATH", import.meta.env.VITE_SOCKET_PARTY_PATH);
export const VITE_SOCKET_GAME_SERVER_PATH	= requireEnv("VITE_SOCKET_GAME_SERVER_PATH", import.meta.env.VITE_SOCKET_GAME_SERVER_PATH);
export const VITE_SOCKET_GAME_BOT_PATH 		= requireEnv("VITE_SOCKET_GAME_BOT_PATH", import.meta.env.VITE_SOCKET_GAME_BOT_PATH);
export const VITE_SOCKET_URL 				= requireEnv("VITE_SOCKET_URL", import.meta.env.VITE_SOCKET_URL);