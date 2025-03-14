import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  base: "/", // ✅ Ensures correct path resolution in Netlify

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

  resolve: {
    alias: {
      "@": "/src", // ✅ Allows easy imports using `@/` instead of long paths
    },
  },

  define: {
    "process.env": {}, // ✅ Prevents `process.env` reference issues in Vite
    "import.meta.env.VITE_BACKEND_URL": JSON.stringify(
      process.env.VITE_BACKEND_URL || "https://acne-ai-backend.onrender.com"
    ),
  },
});
