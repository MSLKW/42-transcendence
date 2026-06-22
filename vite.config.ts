import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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
