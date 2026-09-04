import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
			clientPort: 80,
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