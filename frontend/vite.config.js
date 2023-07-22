import path from 'path';
import fs from 'fs';

import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import react from '@vitejs/plugin-react';

const jsconfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'jsconfig.json'), 'utf-8')
);

const { paths } = jsconfig.compilerOptions;
const aliases = Object.keys(paths || {}).reduce((acc, alias) => {
  if (Array.isArray(paths[alias]) && paths[alias].length > 0) {
    const prefix = alias.replace('/*', '');
    const pathname = paths[alias][0].replace('/*', '');

    acc[prefix] = path.resolve(__dirname, pathname);
  }

  return acc;
}, {});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [jsconfigPaths({ root: __dirname }), react({})],
  resolve: {
    alias: aliases,
  },
  build: {
    emptyOutDir: true,
    outDir: './dist',
    chunkSizeWarningLimit: 700,
    manifest: true,
    minify: false,
    rollupOptions: {
      output: {
        sourcemap: false,
        generatedCode: ['es5'],
      },
    },
  },
  server: {
    open: '/',
  },
  preview: {
    open: '/',
  },
});
