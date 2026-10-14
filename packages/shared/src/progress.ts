import type { Modulo } from './types';

export interface ProgressoState {
  modulosConcluidos: string[];
  /** datas ISO (YYYY-MM-DD) em que a criança escovou */
  diasEscovando: string[];
}

export const progressoVazio = (): ProgressoState => ({ modulosConcluidos: [], diasEscovando: [] });

export const dia = (d: Date): string => d.toISOString().slice(0, 10);

export function concluirModulo(s: ProgressoState, id: string): ProgressoState {
  return s.modulosConcluidos.includes(id) ? s : { ...s, modulosConcluidos: [...s.modulosConcluidos, id] };
}

export function registrarEscovacao(s: ProgressoState, hoje: Date): ProgressoState {
  const d = dia(hoje);
  return s.diasEscovando.includes(d) ? s : { ...s, diasEscovando: [...s.diasEscovando, d] };
}

/** Dias seguidos escovando, terminando hoje ou ontem. */
export function sequenciaDeDias(dias: string[], hoje: Date): number {
  const set = new Set(dias);
  const cursor = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()));
  if (!set.has(dia(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let n = 0;
  while (set.has(dia(cursor))) {
    n++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return n;
}

export function proximoModulo(modulos: Modulo[], s: ProgressoState): Modulo | null {
  return modulos.find((m) => !s.modulosConcluidos.includes(m.id)) ?? null;
}

/** União de dois estados (usado ao sincronizar local + servidor). */
export function mesclar(a: ProgressoState, b: ProgressoState): ProgressoState {
  return {
    modulosConcluidos: [...new Set([...a.modulosConcluidos, ...b.modulosConcluidos])],
    diasEscovando: [...new Set([...a.diasEscovando, ...b.diasEscovando])].sort(),
  };
}
