// TypeScript knows the names and gives autocomplete

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_AUTH_PATH: string;
	readonly VITE_API_PROFILE_PATH: string;
	readonly VITE_API_PARTY_PATH: string;
	readonly VITE_API_FRIENDS_PATH: string;
	readonly VITE_API_GAME_STATS_PATH: string;
	readonly VITE_SOCKET_CHAT_PATH: string;
	readonly VITE_SOCKET_PARTY_PATH: string;
	readonly VITE_SOCKET_GAME_SERVER_PATH: string;
	readonly VITE_SOCKET_GAME_BOT_PATH: string;
	readonly VITE_SOCKET_URL: string;
}