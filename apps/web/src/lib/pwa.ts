import { VitePWA } from 'vite-plugin-pwa';
import { colors } from '../../../../packages/shared/src/tokens'; // relativo: o config do Vite não transpila pacotes do workspace

const icone = (src: string, sizes: string, purpose?: 'any' | 'maskable') => ({ src, sizes, type: 'image/png', ...(purpose ? { purpose } : {}) });

/** PWA instalável, com a aula funcionando offline (módulos, vídeos e fontes em cache) para internet instável na escola. */
export const pwa = () =>
  VitePWA({
    // 'prompt': o professor decide quando atualizar, sem recarregar a página no meio da aula.
    registerType: 'prompt',
    // Ativo também no dev, para testar a instalação sem build.
    devOptions: { enabled: true, type: 'module', navigateFallback: 'index.html' },
    includeAssets: ['brand/icon-180.png', 'brand/icon-32.png', 'brand/logo-icone.svg'],
    manifest: {
      id: '/',
      name: 'Sorriso na Escola',
      short_name: 'Sorriso',
      description: 'Plataforma para o professor conduzir a aula de saúde bucal pelo próprio aparelho, com vídeos, jogos e quizzes.',
      lang: 'pt-BR',
      dir: 'ltr',
      scope: '/',
      start_url: '/professor?origem=pwa',
      display: 'standalone',
      display_override: ['standalone', 'minimal-ui'],
      orientation: 'any',
      categories: ['education', 'kids', 'health'],
      theme_color: colors.turquesa,
      background_color: colors.neve,
      icons: [
        icone('/brand/icon-192.png', '192x192', 'any'),
        icone('/brand/icon-512.png', '512x512', 'any'),
        icone('/brand/icon-maskable-512.png', '512x512', 'maskable'),
      ],
      shortcuts: [
        { name: 'Conduzir aula', short_name: 'Sala', description: 'Abrir o modo sala', url: '/sala?origem=atalho', icons: [icone('/brand/icon-192.png', '192x192')] },
        { name: 'Painel do professor', short_name: 'Painel', url: '/professor?origem=atalho', icons: [icone('/brand/icon-192.png', '192x192')] },
        { name: 'Conteúdo', short_name: 'Conteúdo', url: '/conteudo?origem=atalho', icons: [icone('/brand/icon-192.png', '192x192')] },
      ],
      screenshots: [
        { src: '/pwa/tela-larga.png', sizes: '1280x800', type: 'image/png', form_factor: 'wide', label: 'Painel do professor' },
        { src: '/pwa/tela-celular.png', sizes: '390x844', type: 'image/png', form_factor: 'narrow', label: 'Modo sala no celular' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,ico}'],
      globIgnores: ['**/brand/sorriso-marca.zip', '**/pwa/**'],
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      cleanupOutdatedCaches: true,
      navigateFallback: '/index.html', // SPA: qualquer rota abre offline
      navigateFallbackDenylist: [/^\/api\//, /\/videos\//],
      runtimeCaching: [
        { urlPattern: /\/videos\/.*\.(mp4|webm|vtt)$/, handler: 'CacheFirst', options: { cacheName: 'videos', rangeRequests: true, cacheableResponse: { statuses: [200] }, expiration: { maxEntries: 30 } } },
        { urlPattern: /^https:\/\/fonts\.googleapis\.com\//, handler: 'StaleWhileRevalidate', options: { cacheName: 'fontes-css' } },
        { urlPattern: /^https:\/\/fonts\.gstatic\.com\//, handler: 'CacheFirst', options: { cacheName: 'fontes', cacheableResponse: { statuses: [0, 200] }, expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } } },
      ],
    },
  });
