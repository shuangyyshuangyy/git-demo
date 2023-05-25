import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import pkg from '../../package.json';

export default defineConfig({
  // Please note that `__dirname = packages/preload` in this context.
  root: __dirname,
  // The directory from which `.env` files are loaded.
  // Make sure it should be at the root of the project.
  envDir: process.cwd(),

  build: {
    sourcemap: 'inline',
    outDir: '../../dist/preload',

    emptyOutDir: true,

    lib: {
      entry: 'src/index.ts',
      formats: ['cjs']
    },

    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
        ...Object.keys(pkg.dependencies || {})
      ],

      output: {
        entryFileNames: '[name].cjs'
      }
    }
  }
});
