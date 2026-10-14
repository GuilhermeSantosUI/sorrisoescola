import { useEffect, useSyncExternalStore } from 'react';
import { gravar, ler } from '../lib/storage';
import { sync } from '../lib/api';

export type Papel = 'professor' | 'crianca' | 'responsavel';
export interface TurmaLocal { id: string; nome: string; codigo: string }
interface Estado { pronto: boolean; papel: Papel | null; turma: TurmaLocal | null; apelido: string | null }

let estado: Estado = { pronto: false, papel: null, turma: null, apelido: null };
const ouvintes = new Set<() => void>();
const emitir = (parcial: Partial<Estado>) => { estado = { ...estado, ...parcial }; ouvintes.forEach((l) => l()); };
const KEY = 'sorriso.sessao';

async function persistir() { await gravar(KEY, JSON.stringify({ papel: estado.papel, turma: estado.turma, apelido: estado.apelido })); }

export async function carregarSessao() {
  const raw = await ler(KEY);
  const s = raw ? (JSON.parse(raw) as Partial<Estado>) : {};
  emitir({ pronto: true, papel: s.papel ?? null, turma: s.turma ?? null, apelido: s.apelido ?? null });
}
export async function definirPapel(papel: Papel, extra: Partial<Pick<Estado, 'turma' | 'apelido'>> = {}) { emitir({ papel, ...extra }); await persistir(); }
export async function definirTurma(turma: TurmaLocal) { emitir({ turma }); await persistir(); }
export async function encerrarSessao() { await sync.sair(); emitir({ papel: null, turma: null, apelido: null }); await gravar(KEY, null); }

export function useSessao() {
  useEffect(() => { if (!estado.pronto) void carregarSessao(); }, []);
  return useSyncExternalStore((l) => { ouvintes.add(l); return () => { ouvintes.delete(l); }; }, () => estado);
}
