const KEY = 'sorriso.turma';
export interface TurmaLocal { id: string; nome: string; codigo: string }

export function turmaAtual(): TurmaLocal | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TurmaLocal) : null;
  } catch {
    return null;
  }
}
export function salvarTurma(t: TurmaLocal): void {
  try { localStorage.setItem(KEY, JSON.stringify(t)); } catch { /* sem armazenamento */ }
}
