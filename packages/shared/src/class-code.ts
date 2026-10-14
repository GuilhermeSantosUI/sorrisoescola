/** Alfabeto sem caracteres ambíguos (0/O, 1/I/L). */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const LENGTH = 6;

export class ClassCode {
  private constructor(readonly value: string) {}

  static generate(random: (n: number) => number = defaultRandom): ClassCode {
    let out = '';
    for (let i = 0; i < LENGTH; i++) out += ALPHABET[random(ALPHABET.length)];
    return new ClassCode(out);
  }

  /** Normaliza (maiúsculas, sem espaços/hífen) e valida. Retorna null se inválido. */
  static parse(input: string): ClassCode | null {
    const v = input.toUpperCase().replace(/[\s-]/g, '');
    if (v.length !== LENGTH) return null;
    for (const ch of v) if (!ALPHABET.includes(ch)) return null;
    return new ClassCode(v);
  }

  toString(): string {
    return this.value;
  }
  /** Exibição: ABC-234 */
  format(): string {
    return `${this.value.slice(0, 3)}-${this.value.slice(3)}`;
  }
}

function defaultRandom(n: number): number {
  const a = new Uint32Array(1);
  globalThis.crypto.getRandomValues(a);
  return a[0]! % n;
}

/** Apelido da criança. Nunca nome completo, contato ou número. */
export class Nickname {
  private constructor(readonly value: string) {}

  static parse(input: string): Nickname | null {
    const v = input.trim().replace(/\s+/g, ' ');
    if (v.length < 2 || v.length > 16) return null;
    if (!/^[\p{L}\p{N} ]+$/u.test(v)) return null; // sem @, pontuação etc.
    if ((v.match(/\d/g) ?? []).length > 3) return null; // evita telefone/documento
    if (v.split(' ').length > 2) return null; // evita nome completo
    return new Nickname(v);
  }

  toString(): string {
    return this.value;
  }
}
