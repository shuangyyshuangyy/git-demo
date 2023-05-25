import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';

export default defineConfig({
  envDir: process.cwd(),
  root: __dirname,
  base: './',

  build: {
    outDir: '../../dist/main',
    emptyOutDir: true,
    target: 'node14',
    sourcemap: true,

    lib: {
      entry: './src/index.ts',
      formats: ['cjs']
    },

    rollupOptions: {
      external: [
        'electron',
        ...builtinModules.flatMap((p) => [p, `node:${p}`])
      ],
      output: {
        entryFileNames: '[name].cjs'
      }
    }
  }
});
