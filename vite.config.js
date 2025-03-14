import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    },
    mimeTypes: {
      "application/javascript": ["js", "jsx"],
      "text/css": ["css"], // Ensure CSS is correctly served
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash].[ext]",
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
      },
    },
  },
});
