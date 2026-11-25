import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE || (command === 'build' ? '/transitions-simulator/' : '/'),
  server: {
    port: 5174,
    host: true,
  },
  preview: {
    port: 8081,
    host: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
}));
