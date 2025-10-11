import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use root base in dev; use repo subpath only for production builds (e.g. GitHub Pages)
  const base = command === 'build' ? '/feedback-evaluation-system/' : '/';

  return {
    plugins: [react()],

    // Serve static files from the 'public' folder
    publicDir: 'public',

    // Dev server configuration
    server: {
      port: 5173,  // You can change if needed
      open: true   // Opens browser automatically
    },

    // Build configuration
    build: {
      outDir: 'dist',     // Output folder
      sourcemap: false     // Set to false for production to reduce file size
    },

    // Base path (dynamic)
    base,
  }
})
