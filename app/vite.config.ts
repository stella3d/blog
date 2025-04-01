import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Updated custom plugin to generate _redirects with forced internal rewrite
function generateRedirects() {
  return {
    name: 'generate-redirects',
    generateBundle(this: import('rollup').PluginContext) {
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        // Use 200! to enforce an internal rewrite without infinite looping
        source: '/*  /index.html 200!'
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateRedirects()  // new plugin to insert updated _redirects file
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
