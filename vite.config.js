import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/open-aviation-components/',
  plugins: [vue()],
})
