import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom', // Simulates a browser environment
    globals: true,
    setupFiles: [] // Especifica un array vacío para que no busque vitest.setup.ts
  },
});