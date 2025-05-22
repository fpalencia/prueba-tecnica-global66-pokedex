import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // Esto permite conexiones desde cualquier IP
    port: 3000, // Puedes elegir el puerto que prefieras
  },
  build: {
    // Configuración para Vercel
    outDir: 'dist',
    // Excluir archivos de test durante el build
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      },
      external: ['**/*.spec.*', '**/*.test.*', '**/vitest.setup.*', '**/tests/**']
    }
  }
})
