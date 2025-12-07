import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  // Library build configuration
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'akiInfoDetect',
      fileName: 'aki-info-detect',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        exports: 'named',
        banner: `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the MIT License
 * ${pkg.homepage}
 */`
      }
    },
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    // Copy demo to dist after build
    copyPublicDir: true
  },

  // Public directory (copied to dist)
  publicDir: 'public',

  // Development server configuration
  server: {
    port: 3000,
    open: '/index.html',
    headers: {
      // IMPORTANT: Enable Client Hints for deeper hardware detection
      'Accept-CH': 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List',
      'Critical-CH': 'Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch',
      'Permissions-Policy': 'ch-ua-platform-version=*, ch-ua-arch=*, ch-ua-model=*, ch-ua-bitness=*'
    }
  },

  // Preview server (after build)
  preview: {
    port: 4173,
    open: true,
    headers: {
      'Accept-CH': 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List',
      'Critical-CH': 'Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch',
      'Permissions-Policy': 'ch-ua-platform-version=*, ch-ua-arch=*, ch-ua-model=*, ch-ua-bitness=*'
    }
  }
});
