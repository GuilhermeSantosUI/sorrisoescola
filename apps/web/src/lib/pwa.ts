import { VitePWA } from 'vite-plugin-pwa';
import { colors } from '../../../../packages/shared/src/tokens'; // relativo: o config do Vite não transpila pacotes do workspace

/** PWA com cache dos vídeos e módulos para internet instável na escola. */
export const pwa = () =>
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Sorriso na Escola',
      short_name: 'Sorriso',
      lang: 'pt-BR',
      display: 'fullscreen',
      start_url: '/sala',
      theme_color: colors.turquesa,
      background_color: colors.neve,
      icons: [
        { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      runtimeCaching: [
        { urlPattern: /\/videos\/.*\.(mp4|webm|vtt)$/, handler: 'CacheFirst', options: { cacheName: 'videos', rangeRequests: true, expiration: { maxEntries: 30 } } },
        { urlPattern: /fonts\.(googleapis|gstatic)\.com/, handler: 'StaleWhileRevalidate', options: { cacheName: 'fontes' } },
      ],
    },
  });
