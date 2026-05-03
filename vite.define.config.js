import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/define.ts'),
      formats: ['es'],
      fileName: () => 'define.es.js',
    },
    outDir: 'dist/lib',
    emptyOutDir: false,
  },
})
