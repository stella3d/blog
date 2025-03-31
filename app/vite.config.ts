import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to copy index.html to 404.html after build
function copyIndexTo404Plugin(): PluginOption {
  return {
    name: 'copy-index-to-404',
    writeBundle(options: { dir: any }) {
      const outDir = options.dir;
      const indexPath = path.resolve(outDir, 'index.html');
      const notFoundPath = path.resolve(outDir, '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
        //console.log('Copied index.html to 404.html');
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copyIndexTo404Plugin()
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
