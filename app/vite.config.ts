import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to generate _redirects file for SPA routing
function generateRedirects() {
  return {
    name: 'generate-redirects',
    generateBundle(this: import('rollup').PluginContext) {
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        source: '/*  /index.html  200'
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateRedirects()  // new plugin to insert _redirects file
  ],
  build: {
    outDir: 'dist',
    // Set assetsDir to empty so that no extra directory is created
    assetsDir: '',
    rollupOptions: {
      output: {
        // This tells Rollup not to nest asset files inside an "assets" directory
        assetFileNames: '[name].[ext]',
      }
    }
  }
})
