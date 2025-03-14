import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./", // ✅ Ensures relative paths work on Netlify

  server: {
    port: 5173,
    cors: true,
    proxy: {
      "/api": {
        target: "https://acne-ai-backend.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: true, // ✅ Helps debug Netlify errors
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },

  define: {
    "process.env": {}, // ✅ Fixes potential process.env issues
  },
});
