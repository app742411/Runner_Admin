import path from 'path';
import checker from 'vite-plugin-checker';
import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// ----------------------------------------------------------------------

const PORT = 5173;
const env = loadEnv('all', process.cwd());

export default defineConfig({
  // ADD THIS (prevents Vite cache loop)
  cacheDir: 'node_modules/.vite-cache',

  plugins: [
    react(),
    tailwindcss(),
    // checker({
    //   eslint: {
    //     lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
    //   },
    //   overlay: false, // Changed from overlay: { ... } to avoid blocking browser reloads with linting errors.
    // }),

  ],

  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },

  // IMPORTANT: stabilize dependency optimization
  optimizeDeps: {
    // force: true, // Removed for better performance. Use only if dependencies change frequently without being detected.
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      // '@mui/material',
      // '@mui/icons-material',
      // '@tanstack/react-query',
      // 'react-redux',
      // 'react-hot-toast',
      // 'react-helmet-async',
    ],
  },

  server: {
    port: PORT,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'https://runner-backend.server24.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  preview: {
    port: PORT,
    host: true,
  },
});
