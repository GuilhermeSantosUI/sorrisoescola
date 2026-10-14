/** UUID v7 (RFC 9562): 48 bits de timestamp ms + aleatório. */
export type Uuid = string & { readonly __brand: 'Uuid' };

export function uuidv7(now: number = Date.now()): Uuid {
  const b = new Uint8Array(16);
  globalThis.crypto.getRandomValues(b);
  b[0] = (now / 2 ** 40) & 255;
  b[1] = (now / 2 ** 32) & 255;
  b[2] = (now >>> 24) & 255;
  b[3] = (now >>> 16) & 255;
  b[4] = (now >>> 8) & 255;
  b[5] = now & 255;
  b[6] = (b[6]! & 0x0f) | 0x70;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}` as Uuid;
}

export const isUuid = (v: string): v is Uuid =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
