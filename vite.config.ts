
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  /**
  __WS_TOKEN__: (() => {
    if (!process.env.VITE_WS_TOKEN) {
      throw new Error("Environment variable VITE_WS_TOKEN is not set. Please set it before building the project.");
    }
    return JSON.stringify(process.env.VITE_WS_TOKEN);
  })(),
  */
  server: {
    port: 8080,
    hmr: {
      clientPort: 8080,
    },
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
