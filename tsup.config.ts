import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'tsup'
  ],
  outDir: 'dist',
  dts: true,
  format: ['cjs', 'esm', 'iife'],
  platform: 'browser',
})
