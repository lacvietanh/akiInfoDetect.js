import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Library build configuration
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'akiInfoDetect',
      fileName: 'aki-info-detect',
      formats: ['es', 'umd']
    },
    // Fix for named + default exports
    rollupOptions: {
      output: {
        exports: 'named',
        banner: `/*!
 * aki-info-detect v2.0.0
 * (c) ${new Date().getFullYear()} lacvietanh
 * Released under the MIT License
 * https://github.com/lacvietanh/akiInfoDetect.js
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
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    open: '/demo/index.html',
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
    headers: {
      'Accept-CH': 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List',
      'Critical-CH': 'Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch',
      'Permissions-Policy': 'ch-ua-platform-version=*, ch-ua-arch=*, ch-ua-model=*, ch-ua-bitness=*'
    }
  }
});
