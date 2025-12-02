import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    envPrefix: "API_",
    server: {
      host: "::",
      port: 5173,
      hmr: {
        clientPort: 5173,
      },
      proxy: {
        '/api': {
          target: mode === 'production' ? env.API_URL_PROD : env.API_URL_DEV,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/auth': {
          target: mode === 'production' ? env.API_URL_PROD : env.API_URL_DEV,
          changeOrigin: true,
        },
        '/parser/parse': {
          target: mode === 'production' ? env.API_URL_PROD : env.API_URL_DEV,
          changeOrigin: true,
        },
        '/profile': {
          target: mode === 'production' ? env.API_URL_PROD : env.API_URL_DEV,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});