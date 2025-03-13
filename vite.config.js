import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Increased limit to handle large dependencies
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tensorflow")) return "tensorflow"; // TensorFlow.js chunk
            if (id.includes("react")) return "react"; // Separate React for caching
            return "vendor"; // Other dependencies
          }
        }
      }
    }
  },
  esbuild: {
    minify: true, // Minifies JavaScript output
    target: "esnext", // Ensures compatibility with modern browsers
  },
  server: {
    host: true, // Enables network access
    port: 3000, // Sets default port
    open: true, // Auto-opens browser on start
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tensorflow/tfjs"], // Pre-bundle critical dependencies
  }
});
