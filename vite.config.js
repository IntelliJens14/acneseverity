import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, // Custom port for local development
    cors: true,  // Enable CORS
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "https://acne-ai-backend.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Proxy `/api` calls
      },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: true, // Helpful for debugging in production
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },

  // Netlify Optimization
  define: {
    "process.env.VITE_BACKEND_URL": JSON.stringify(process.env.VITE_BACKEND_URL || "https://acne-ai-backend.onrender.com"),
  },
});
