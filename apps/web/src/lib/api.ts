import { createApiClient, createSync, type TokenStore, type Tokens } from '@sorriso/shared';

const KEY = 'sorriso.tokens';

export const tokenStore: TokenStore = {
  async get() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Tokens) : null;
    } catch {
      return null;
    }
  },
  async set(t) {
    try {
      if (t) localStorage.setItem(KEY, JSON.stringify(t));
      else localStorage.removeItem(KEY);
    } catch {
      /* armazenamento indisponível */
    }
  },
};

/** API simulada (dados de demonstração). A flag é substituída no build; em produção o ramo some do bundle. */
export const usandoMock = __USE_MOCKS__;

/** Em produção `__USE_MOCKS__` é false: o ramo (e o import dinâmico) é removido do bundle. */
function criarFetchDemo(): typeof fetch | undefined {
  if (__USE_MOCKS__) {
    let mock: typeof fetch | undefined;
    return async (input, init) => {
      mock ??= (await import('@sorriso/shared/mocks')).createMockFetch();
      return mock(input, init);
    };
  }
  return undefined;
}

const baseUrl = import.meta.env.VITE_API_URL as string;
export const sync = createSync(
  createApiClient({ baseUrl, tokens: tokenStore, fetch: criarFetchDemo() }),
  tokenStore,
);
