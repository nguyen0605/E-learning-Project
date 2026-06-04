import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isBuild = process.argv.includes("build");

// https://vite.dev/config/
export default defineConfig({
  cacheDir: isBuild ? ".vite-cache/build" : `.vite-cache/dev-${Date.now()}`,
  build: {
    emptyOutDir: false,
  },
  plugins: [react()],
})
