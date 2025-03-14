import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: "https://acne-ai-backend.onrender.com", // ✅ Allow backend API access
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    },
    proxy: {
      '/api': {
        target: 'https://acne-ai-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets", // ✅ Ensures assets are placed in a separate folder
    rollupOptions: {
      input: {
        main: "index.html",
      },
      output: {
        chunkSizeWarningLimit: 1500, // ✅ Allows larger chunks
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
  publicDir: "public", // ✅ Ensures public assets are included
  assetsInclude: ["**/*.bin", "**/*.json", "**/*.jpg", "**/*.png"], // ✅ Includes extra assets
});

