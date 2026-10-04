import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Agregamos el plugin de Tailwind v4 (ya no necesita tailwind.config.js)
// y configuramos el proxy para que las peticiones a /api se redirijan
// al backend de Spring Boot en el puerto 8080.
// Esto evita problemas de CORS en desarrollo.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
