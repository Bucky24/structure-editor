import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default function getVite(dir) {
  return defineConfig({
    root: dir,
    outDir: path.join(__dirname, "..", "build"),
    plugins: [react()],
    server: {
      port: 8080,
    },
    base: "./",
    esbuild: {
      loader: "tsx"
    },
    resolve: {
      alias: {
        '@bucky24/structure-editor': path.resolve(__dirname, '../src/index.js'),
      },
    },
  });
}