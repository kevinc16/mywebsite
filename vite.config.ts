import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  build: {
    assetsDir: "static"
  }
});
