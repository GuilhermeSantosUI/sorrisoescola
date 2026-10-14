import { mesclar, progressoVazio, type ProgressoState } from '@sorriso/shared';
import { sync } from '../lib/api';
import { gravar, ler } from '../lib/storage';

const KEY = 'sorriso.progresso';

export async function lerProgresso(): Promise<ProgressoState> {
  const raw = await ler(KEY);
  return raw ? (JSON.parse(raw) as ProgressoState) : progressoVazio();
}
export const salvarProgresso = (p: ProgressoState) => gravar(KEY, JSON.stringify(p));

/** Salva local sempre; sincroniza quando houver conexão (falha silenciosa, tenta de novo depois). */
export async function salvarESincronizar(p: ProgressoState): Promise<void> {
  await salvarProgresso(p);
  try { await sync.enviarProgresso(p); } catch { /* offline: o estado local vale até a próxima tentativa */ }
}
export { mesclar };
