// vite.config.js
import path from "path";
import checker from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/vite-plugin-checker/dist/esm/main.js";
import { loadEnv, defineConfig } from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/@vitejs/plugin-react-swc/index.mjs";
import tailwindcss from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/@tailwindcss/vite/dist/index.mjs";
var PORT = 5173;
var env = loadEnv("all", process.cwd());
var vite_config_default = defineConfig({
  // ADD THIS (prevents Vite cache loop)
  cacheDir: "node_modules/.vite-cache",
  plugins: [
    react(),
    tailwindcss(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"'
      },
      overlay: {
        position: "tl",
        initialIsOpen: false
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ]
  },
  // IMPORTANT: stabilize dependency optimization
  optimizeDeps: {
    force: true,
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@mui/material",
      "@mui/icons-material",
      "@tanstack/react-query",
      "react-redux",
      "react-hot-toast",
      "react-helmet-async"
    ]
  },
  server: {
    port: PORT,
    host: true,
    cors: true,
    proxy: {
      "/api": {
        target: "https://runner-backend.server24.in",
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: PORT,
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTYXZvMVxcXFxEZXNrdG9wXFxcXEFuYW5kXFxcXFJ1bm5lclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcU2F2bzFcXFxcRGVza3RvcFxcXFxBbmFuZFxcXFxSdW5uZXJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1Nhdm8xL0Rlc2t0b3AvQW5hbmQvUnVubmVyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcbmltcG9ydCB7IGxvYWRFbnYsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IFBPUlQgPSA1MTczO1xuY29uc3QgZW52ID0gbG9hZEVudignYWxsJywgcHJvY2Vzcy5jd2QoKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIEFERCBUSElTIChwcmV2ZW50cyBWaXRlIGNhY2hlIGxvb3ApXG4gIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlLWNhY2hlJyxcblxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0YWlsd2luZGNzcygpLFxuICAgIGNoZWNrZXIoe1xuICAgICAgZXNsaW50OiB7XG4gICAgICAgIGxpbnRDb21tYW5kOiAnZXNsaW50IFwiLi9zcmMvKiovKi57anMsanN4LHRzLHRzeH1cIicsXG4gICAgICB9LFxuICAgICAgb3ZlcmxheToge1xuICAgICAgICBwb3NpdGlvbjogJ3RsJyxcbiAgICAgICAgaW5pdGlhbElzT3BlbjogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiAvXn4oLispLyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbm9kZV9tb2R1bGVzLyQxJyksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaW5kOiAvXnNyYyguKykvLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICAvLyBJTVBPUlRBTlQ6IHN0YWJpbGl6ZSBkZXBlbmRlbmN5IG9wdGltaXphdGlvblxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBmb3JjZTogdHJ1ZSxcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAnQG11aS9tYXRlcmlhbCcsXG4gICAgICAnQG11aS9pY29ucy1tYXRlcmlhbCcsXG4gICAgICAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JyxcbiAgICAgICdyZWFjdC1yZWR1eCcsXG4gICAgICAncmVhY3QtaG90LXRvYXN0JyxcbiAgICAgICdyZWFjdC1oZWxtZXQtYXN5bmMnLFxuICAgIF0sXG4gIH0sXG5cbiAgc2VydmVyOiB7XG4gICAgcG9ydDogUE9SVCxcbiAgICBob3N0OiB0cnVlLFxuICAgIGNvcnM6IHRydWUsXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3J1bm5lci1iYWNrZW5kLnNlcnZlcjI0LmluJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiBQT1JULFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVMsT0FBTyxVQUFVO0FBQ3hULE9BQU8sYUFBYTtBQUNwQixTQUFTLFNBQVMsb0JBQW9CO0FBQ3RDLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUl4QixJQUFNLE9BQU87QUFDYixJQUFNLE1BQU0sUUFBUSxPQUFPLFFBQVEsSUFBSSxDQUFDO0FBRXhDLElBQU8sc0JBQVEsYUFBYTtBQUFBO0FBQUEsRUFFMUIsVUFBVTtBQUFBLEVBRVYsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLFVBQVU7QUFBQSxRQUNWLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxpQkFBaUI7QUFBQSxNQUN6RDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVE7QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLGNBQWM7QUFBQSxJQUNaLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
