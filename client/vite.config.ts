import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
});
