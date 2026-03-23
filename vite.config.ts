import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node20',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/extension.ts'),
      formats: ['cjs'],
      fileName: () => 'extension.js'
    },
    rollupOptions: {
      external: ['vscode'],
      output: {
        exports: 'named'
      }
    }
  }
});
