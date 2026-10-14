import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En desarrollo, todo lo que empiece con /api se reenvia al backend (puerto 3000).
// Asi el navegador cree que front y back son el mismo origen: no hay problemas de CORS
// y las cookies httpOnly de sesion viajan solas.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
