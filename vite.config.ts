import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/mw": {
        target: "https://app.motowarsztat.pl",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/mw/, "/api"),
      },
    },
  },

  build: {
    target: "es2019",
  },

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});