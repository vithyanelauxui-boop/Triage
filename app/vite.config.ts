import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        // Isolated Shopify Polaris entry — its own bundle so Polaris's global
        // CSS (html/body resets, its own font stack) never touches the main
        // app's document. Embedded via iframe, not imported directly.
        polarisKpi: path.resolve(__dirname, 'polaris-kpi.html'),
      },
    },
  },
});
