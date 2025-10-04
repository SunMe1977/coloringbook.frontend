import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl'; // Import the plugin

export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // Add this plugin for HTTPS
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'service-worker.js', 
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'favicon-96x96.png',
        'apple-touch-icon.png',
        'web-app-manifest-192x192.png',
        'web-app-manifest-512x512.png',
        'robots.txt',
      ],
      manifest: {
        name: 'AI SelfPub ColoringBook Studio',
        short_name: 'AI SelfPub ColoringBook Studio',
        description: 'AI SelfPub ColoringBook Studio - Easily create personalized coloring books with AI assistance.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        swDest: 'dist/service-worker.js',
        navigateFallback: 'index.html',
        navigateFallbackAllowlist: [/.*/],
      },
      devOptions: {
        enabled: true,
      },
      manifestFilename: 'site.webmanifest',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@constants': path.resolve(__dirname, 'src/constants/index.ts'),
      '@home': path.resolve(__dirname, 'src/home'),
      '@util': path.resolve(__dirname, 'src/util'),
      '@user': path.resolve(__dirname, 'src/user'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
    https: true, // Changed to true to enable HTTPS
    fs: {
      strict: false,
    },
  },
  base: '/',
});