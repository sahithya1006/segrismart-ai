import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  base: '/jaswanthmucherla/segresmart-ai/',
  plugins: [
    react(),
    tailwindcss(),
    basicSsl()
  ],
  // Add this block to support older mobile browsers
  build: {
    target: 'es2015'
  }
})