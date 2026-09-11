import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://blogwebsite-vb09.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [
    react(),
    tailwindcss(),
  ],
})
