import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// generate SPA routing redirects for cf pages
function generateRedirects() {
  return {
    name: 'generate-redirects',
    generateBundle(this: import('rollup').PluginContext) {
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        // Adding an explicit rule for /index.html to prevent infinite loop
        source: `/index.html  /index.html 200
/*  /index.html 200`
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
