import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        // target: 'http://192.168.22.188:8088',
        // target: 'https://cmu-be.dev.xuxusheng.com',
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/socket.io': {
        ws: true,
        // target: 'http://192.168.22.188:8088',
        target: 'https://cmu-be.dev.xuxusheng.com',
        // target: 'ws://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
