import { TEMAS, type Tema } from './types';
import type { RespostaQuizApi } from './api/mappers';

export interface ResumoTema { tema: Tema; nome: string; percentual: number; tentativas: number }

export function resumoPorTema(rows: RespostaQuizApi[]): ResumoTema[] {
  const acc = new Map<Tema, { a: number; t: number; n: number }>();
  for (const r of rows) {
    const cur = acc.get(r.tema as Tema) ?? { a: 0, t: 0, n: 0 };
    acc.set(r.tema as Tema, { a: cur.a + r.acertos, t: cur.t + r.total, n: cur.n + 1 });
  }
  return [...acc].map(([tema, v]) => ({ tema, nome: TEMAS[tema], percentual: v.t === 0 ? 0 : Math.round((v.a / v.t) * 100), tentativas: v.n }));
}

export const mediaGeral = (rows: RespostaQuizApi[]) =>
  rows.length === 0 ? 0 : Math.round(rows.reduce((s, r) => s + r.pontuacao, 0) / rows.length);
