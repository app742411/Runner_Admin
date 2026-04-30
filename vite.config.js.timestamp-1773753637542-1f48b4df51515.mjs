// vite.config.js
import path from "path";
import checker from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/vite-plugin-checker/dist/esm/main.js";
import { loadEnv, defineConfig } from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/@vitejs/plugin-react-swc/index.mjs";
import tailwindcss from "file:///C:/Users/Savo1/Desktop/Anand/Runner/node_modules/@tailwindcss/vite/dist/index.mjs";
var PORT = 3001;
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
    host: true
  },
  preview: {
    port: PORT,
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTYXZvMVxcXFxEZXNrdG9wXFxcXEFuYW5kXFxcXFJ1bm5lclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcU2F2bzFcXFxcRGVza3RvcFxcXFxBbmFuZFxcXFxSdW5uZXJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1Nhdm8xL0Rlc2t0b3AvQW5hbmQvUnVubmVyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcbmltcG9ydCB7IGxvYWRFbnYsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IFBPUlQgPSAzMDAxO1xuY29uc3QgZW52ID0gbG9hZEVudignYWxsJywgcHJvY2Vzcy5jd2QoKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIFx1MjcwNSBBREQgVEhJUyAocHJldmVudHMgVml0ZSBjYWNoZSBsb29wKVxuICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZS1jYWNoZScsXG5cbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgICBjaGVja2VyKHtcbiAgICAgIGVzbGludDoge1xuICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCBcIi4vc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9XCInLFxuICAgICAgfSxcbiAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgcG9zaXRpb246ICd0bCcsXG4gICAgICAgIGluaXRpYWxJc09wZW46IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcblxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogL15+KC4rKS8sXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmluZDogL15zcmMoLispLyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjLyQxJyksXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgLy8gXHUyNzA1IElNUE9SVEFOVDogc3RhYmlsaXplIGRlcGVuZGVuY3kgb3B0aW1pemF0aW9uXG4gIG9wdGltaXplRGVwczoge1xuICAgIGZvcmNlOiB0cnVlLFxuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdAbXVpL21hdGVyaWFsJyxcbiAgICAgICdAbXVpL2ljb25zLW1hdGVyaWFsJyxcbiAgICAgICdAdGFuc3RhY2svcmVhY3QtcXVlcnknLFxuICAgICAgJ3JlYWN0LXJlZHV4JyxcbiAgICAgICdyZWFjdC1ob3QtdG9hc3QnLFxuICAgICAgJ3JlYWN0LWhlbG1ldC1hc3luYycsXG4gICAgXSxcbiAgfSxcblxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiBQT1JULFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG5cbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IFBPUlQsXG4gICAgaG9zdDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxPQUFPLFVBQVU7QUFDeFQsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsU0FBUyxvQkFBb0I7QUFDdEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBSXhCLElBQU0sT0FBTztBQUNiLElBQU0sTUFBTSxRQUFRLE9BQU8sUUFBUSxJQUFJLENBQUM7QUFFeEMsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixVQUFVO0FBQUEsRUFFVixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsVUFBVTtBQUFBLFFBQ1YsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLGlCQUFpQjtBQUFBLE1BQ3pEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsUUFBUTtBQUFBLE1BQ2hEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
