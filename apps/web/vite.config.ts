import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { pwa } from './src/lib/pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwind(), pwa()],
    publicDir: 'public',
    resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
    server: { fs: { allow: ['../..'] } },
    // Constante de build: em produção é sempre false, então o código de demonstração é removido do bundle.
    define: { __USE_MOCKS__: JSON.stringify(mode !== 'production' && env.VITE_USE_MOCKS === 'true') },
  };
});
