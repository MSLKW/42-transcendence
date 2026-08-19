import { defineConfig } from 'vite'
import { resolve } from 'node:path'

console.log('Running vite configuration');

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
	rolldownOptions: {
		input: {
			login: resolve(import.meta.dirname, 'index.html'),
			game: resolve(import.meta.dirname, 'game.html')
		}
	}
  },
  server: {
	host: true,
	allowedHosts: true,
	port: 5000,
	watch: {
		usePolling: true,
	},
	ws: {
		clientPort: 80,
		protocol: 'ws',
		host: 'localhost',
	}
  }
})