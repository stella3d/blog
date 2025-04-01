import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Updated custom plugin to generate _redirects file for post routes using regex
function generateRedirects() {
  return {
    name: 'generate-redirects',
    generateBundle(this: import('rollup').PluginContext) {
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        // Rule 1: Prevent rewriting /index.html (3 tokens).
        // Rule 2: Match any URL starting with /post/ and rewrite to /index.html (using regex) (3 tokens).
        source: `/index.html  /index.html 200
^/post/.*$  /index.html 200`
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
