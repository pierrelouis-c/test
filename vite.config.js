import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API calls during development to avoid CORS issues
      "/kaamelott": {
        target: "https://kaamelott.chaudie.re",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/kaamelott/, ""),
      },
    },
  },
});
