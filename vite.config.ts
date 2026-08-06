import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import vitePrerender from "vite-plugin-prerender";

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
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.resolve(__dirname, "dist"),
      routes: ["/"],
      renderer: new (vitePrerender as any).PuppeteerRenderer({
        headless: true,
        args: ["--no-sandbox", "--disable-gpu"],
      }),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
