import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Separar vendors pesados en chunks propios para mejor caché del navegador.
        // Si el código de la app cambia, estos chunks no se re-descargan.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase':     ['@supabase/supabase-js'],
          'icons':        ['lucide-react'],
        },
      },
    },
  },
})