import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { join } from 'path';
import { fileURLToPath, URL } from 'url';
import svgLoader from 'vite-svg-loader';
import compress from 'vite-compression-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: true
    }),
    svgLoader({
      svgoConfig: {
        multipass: true,
        plugins: ['removeDimensions']
      }
    }),

    compress({ loginfo: 'silent' })
  ],
  root: __dirname,
  base: '/watchface-editor-renderer/',

  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer',

    rollupOptions: {
      input: join(__dirname, 'index.html'),
      plugins: [visualizer({ filename: 'dist/renderer/stats.html' }) as any],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ]
  },
  css: {
    postcss: join(__dirname, 'postcss.config.cjs'),
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
});
