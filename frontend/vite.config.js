import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/aether': {
        target: 'http://54.157.214.133',
        changeOrigin: true,
        secure: false,
        // ADICIONE ESTA LINHA ABAIXO:
        rewrite: (path) => path.replace(/^\/aether/, ''), 
      },
      '/sanctum': {
        target: 'http://54.157.214.133',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})