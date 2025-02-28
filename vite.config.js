// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  devServer: {
    host: '0.0.0.0',
    port: '8084'
  },
  server: {
    host: '0.0.0.0',
    port: '8084'
  }
})