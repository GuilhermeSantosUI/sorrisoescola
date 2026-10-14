import { progressoVazio, type ProgressoState } from '@sorriso/shared';

const KEY = 'sorriso.progresso';
export function lerProgresso(): ProgressoState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressoState) : progressoVazio();
  } catch {
    return progressoVazio();
  }
}
export function salvarProgresso(p: ProgressoState): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* sem armazenamento */ }
}
