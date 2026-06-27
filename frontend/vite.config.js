import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Port ini harus SAMA dengan PORT di server.js tadi
        changeOrigin: true,
        secure: false,
      },
    },
  },
})