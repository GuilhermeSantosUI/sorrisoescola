import { createApiClient, createSync, type TokenStore, type Tokens } from '@sorriso/shared';
import { gravar, ler } from './storage';

const KEY = 'sorriso.tokens';

export const tokenStore: TokenStore = {
  async get() { const raw = await ler(KEY); return raw ? (JSON.parse(raw) as Tokens) : null; },
  async set(t) { await gravar(KEY, t ? JSON.stringify(t) : null); },
};

function criarFetchDemo(): typeof fetch | undefined {
  if (process.env.EXPO_PUBLIC_USE_MOCKS === 'true') {
    let mock: typeof fetch | undefined;
    return async (input, init) => {
      mock ??= (await import('@sorriso/shared/mocks')).createMockFetch();
      return mock(input, init);
    };
  }
  return undefined;
}

export const sync = createSync(
  createApiClient({ baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '', tokens: tokenStore, fetch: criarFetchDemo() }),
  tokenStore,
);
