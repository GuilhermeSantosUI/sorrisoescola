import createClient from 'openapi-fetch';
import type { paths } from './schema';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/** Armazenamento de tokens: localStorage no web, SecureStore no mobile. */
export interface TokenStore {
  get(): Promise<Tokens | null>;
  set(t: Tokens | null): Promise<void>;
}

export interface ClientOptions {
  baseUrl: string;
  tokens: TokenStore;
  fetch?: typeof fetch;
}

export function createApiClient({ baseUrl, tokens, fetch: base = globalThis.fetch }: ClientOptions) {
  let refreshing: Promise<Tokens | null> | null = null;

  const refresh = (): Promise<Tokens | null> =>
    (refreshing ??= (async () => {
      try {
        const cur = await tokens.get();
        if (!cur) return null;
        const res = await base(`${baseUrl}/auth/renovar`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken: cur.refreshToken }),
        });
        if (!res.ok) {
          await tokens.set(null);
          return null;
        }
        const next = (await res.json()) as Tokens;
        await tokens.set({ accessToken: next.accessToken, refreshToken: next.refreshToken });
        return next;
      } finally {
        refreshing = null;
      }
    })());

  const authedFetch: typeof fetch = async (input, init) => {
    const req = new Request(input, init);
    const retry = req.clone();
    const cur = await tokens.get();
    if (cur) req.headers.set('authorization', `Bearer ${cur.accessToken}`);
    const res = await base(req);
    if (res.status !== 401 || !cur) return res;
    const next = await refresh();
    if (!next) return res;
    retry.headers.set('authorization', `Bearer ${next.accessToken}`);
    return base(retry);
  };

  return createClient<paths>({ baseUrl, fetch: authedFetch });
}

export type ApiClient = ReturnType<typeof createApiClient>;

/** Converte o resultado do openapi-fetch em dado ou ApiError. */
export function unwrap<T>(r: { data?: T; error?: unknown; response: Response }): T {
  if (r.error !== undefined || !r.response.ok) {
    throw new ApiError(r.response.status, `Erro ${r.response.status} da API`, r.error);
  }
  return r.data as T;
}
