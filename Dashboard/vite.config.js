import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5176,
    proxy: {
      '/api': {
        target: 'https://blogwebsite-vb09.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

