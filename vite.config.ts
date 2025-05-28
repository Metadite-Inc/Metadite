
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
  define: {
    // Define the WebSocket token that Vite expects
    __WS_TOKEN__: JSON.stringify(process.env.VITE_WS_TOKEN || ''),
  },
  server: {
    hmr: {
      // Configure HMR WebSocket properly
      clientPort: undefined,
      port: undefined,
    },
    // Ensure WebSocket connections work properly
    host: true,
  },
  build: {
    // Ensure build works correctly
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
