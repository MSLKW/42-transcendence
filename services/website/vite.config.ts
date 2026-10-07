import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const REQUIRED_ENV = [
	"VITE_API_AUTH_PATH",
	"VITE_API_PROFILE_PATH",
	"VITE_API_PARTY_PATH",
	"VITE_API_FRIENDS_PATH",
	"VITE_API_GAME_STATS_PATH",
	"VITE_SOCKET_CHAT_PATH",
	"VITE_SOCKET_PARTY_PATH",
	"VITE_SOCKET_GAME_SERVER_PATH",
	"VITE_SOCKET_GAME_BOT_PATH",
	"VITE_SOCKET_URL",
];

// runs in, where?		: in Node, inside the container
// error thrown, when?	: the dev server or build starts
// error thrown, where?	: in docker logs
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length)
	throw new Error(`[Error] Missing environment variables: ${missing.join(", ")}`);

export default defineConfig({
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		watch: {
			usePolling: true,
		},
		ws: {
			host: 'localhost',
			port: 5173,
			clientPort: process.env.DOMAIN_PORT ? Number(process.env.DOMAIN_PORT) : 80,
		},
		allowedHosts: true,
		// allowedHosts: [
		// 	"website"
		// ],
		// proxy: {
		// 	"/api": {
		// 		target: "http://localhost:3000",
		// 		changeOrigin: true,
		// 		rewrite: (path) => path.replace(/^\/api/, ""),
		// 	}
		// }
	},
	plugins: [
		react(),
		tailwindcss(),
	],
	build: {
		chunkSizeWarningLimit: 1000, 
		rolldownOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
						return '3d-vendor';
					}
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
			},
		},
	},
})