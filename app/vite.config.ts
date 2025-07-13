import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to generate _redirects file for post routes
function generateRedirects() {
  return {
    name: 'generate-redirects',
    generateBundle(this: import('rollup').PluginContext) {
      this.emitFile({
        type: 'asset',
        fileName: '_redirects',
        source: `/index.html  /index.html 200
/post/*  / 200`
      })
    }
  }
}

// Plugin to generate _headers file for Cloudflare Pages CORS
function generateHeaders() {
  return {
    name: 'generate-headers',
    generateBundle(this: import('rollup').PluginContext) {
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: `/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, HEAD, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  Cache-Control: public, max-age=31536000`
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateRedirects(),  // plugin for post routing
    generateHeaders()     // plugin for CORS headers
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
  },
  // Add CORS headers during development
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type']
    }
  }
})
