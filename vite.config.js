import { defineConfig } from 'vite'

console.log('Running vite configuration');

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})