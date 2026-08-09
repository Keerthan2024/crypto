import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Allow connections from the local network (e.g. your phone)
    allowedHosts: true, // Allow tunneling services like localtunnel
    proxy: {
      '/auth': 'http://127.0.0.1:8000',
      '/files': 'http://127.0.0.1:8000',
      '/users': 'http://127.0.0.1:8000',
    }
  }
})
