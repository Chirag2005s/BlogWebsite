import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    port: 5176,
    proxy: {
      '/api': {
        target: 'https://blogwebsite-y8o6.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

