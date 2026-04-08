import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/aviation-learning-components/',
  plugins: [vue()],
  resolve: {
    alias: {
      // Stub @slidev/client so components work outside of a Slidev project.
      // In a Slidev project this alias is not present, so the real package is used.
      '@slidev/client': fileURLToPath(new URL('./src/slidev-stub.js', import.meta.url)),
    },
  },
})
