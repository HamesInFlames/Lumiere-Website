import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host:true,
    port: 8000,          
    strictPort: true,   
    open: true,
    proxy: {
      '/api': 'http://localhost:3000' // backend stays on 3000
    }
  }
})
