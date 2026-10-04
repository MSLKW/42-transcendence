// TypeScript knows the names and gives autocomplete

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly API_AUTH_PATH: string;
	readonly API_PROFILE_PATH: string;
	readonly API_PARTY_PATH: string;
	readonly API_FRIENDS_PATH: string;
	readonly API_GAME_STATS_PATH: string;
	readonly SOCKET_CHAT_PATH: string;
	readonly SOCKET_PARTY_PATH: string;
	readonly SOCKET_GAME_SERVER_PATH: string;
	readonly SOCKET_GAME_BOT_PATH: string;
}