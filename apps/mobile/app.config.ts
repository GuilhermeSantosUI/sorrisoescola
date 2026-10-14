import type { ExpoConfig } from 'expo/config';
// O carregador de config do Expo não transpila imports de .ts do workspace, então estes valores
// espelham packages/shared/src/tokens.ts (turquesa e neve). O teste app.config.test.ts garante a paridade.
/* eslint-disable no-restricted-syntax */
const colors = { turquesa: '#53D9C5', neve: '#F4FBF9' } as const;
/* eslint-enable no-restricted-syntax */

const config: ExpoConfig = {
  name: 'Sorriso na Escola',
  slug: 'sorriso-na-escola',
  scheme: 'sorriso',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light', // somente tema claro
  ios: { bundleIdentifier: 'br.edu.unit.sorriso', supportsTablet: true }, // TODO: confirmar identificadores
  android: { package: 'br.edu.unit.sorriso', adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: colors.turquesa } },
  web: { bundler: 'metro' },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-font',
    ['expo-splash-screen', { image: './assets/brand/logo-sem-fundo.png', imageWidth: 240, backgroundColor: colors.neve }],
  ],
  experiments: { typedRoutes: true },
  icon: './assets/icon.png',
  // TODO: ajustar android.adaptiveIcon (assets/adaptive-icon.png) após testar em dispositivo
};
export default config;
