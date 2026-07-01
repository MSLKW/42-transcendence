import { defineConfig } from 'vite'
import { resolve } from 'node:path'

console.log('Running vite configuration');

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
	rolldownOptions: {
		input: {
			login: resolve(__dirname, 'index.html'),
			game: resolve(__dirname, 'game.html')
		}
	}
  }
})