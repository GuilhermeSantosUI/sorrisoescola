import type { components } from './schema';
import type { ResultadoQuiz } from '../quiz';
import type { Tema } from '../types';
import type { ProgressoState } from '../progress';

export type RespostaQuizApi = components['schemas']['RespostaQuiz'];
export type AlunoApi = components['schemas']['Aluno'];
export type AcompanhamentoApi = components['schemas']['Acompanhamento'];
export type ProgressoApi = components['schemas']['Progresso'];

export function resultadoParaApi(moduloId: string, tema: Tema, r: ResultadoQuiz, duracaoSegundos: number): RespostaQuizApi {
  return {
    moduloId,
    tema,
    acertos: r.acertos,
    total: r.total,
    pontuacao: Math.round(r.pontuacao),
    duracaoSegundos: Math.round(duracaoSegundos),
  };
}

/** A API guarda inteiros; a UI mostra "80%" e "2 min 05 s". */
export const formatarPorcentagem = (pontuacao: number): string => `${pontuacao}%`;

export function formatarDuracao(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return m === 0 ? `${s} s` : `${m} min ${String(s).padStart(2, '0')} s`;
}

export const progressoParaApi = (p: ProgressoState): ProgressoApi => ({ ...p });
export const progressoDaApi = (p: ProgressoApi): ProgressoState => ({ ...p });

/** CSV para o relatório de devolutiva (sem dados pessoais; apenas agregados por módulo). */
export function resultadosParaCsv(rows: RespostaQuizApi[]): string {
  const head = 'modulo,tema,acertos,total,pontuacao_pct,duracao_s';
  const lines = rows.map((r) => [r.moduloId, r.tema, r.acertos, r.total, r.pontuacao, r.duracaoSegundos].join(','));
  return [head, ...lines].join('\n');
}

/** "12/10/2026" em pt-BR; vazio se a data for inválida. */
export function formatarData(iso?: string): string {
  if (!iso) return 'ainda sem atividade';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? 'ainda sem atividade' : d.toLocaleDateString('pt-BR');
}

/** Percentual de módulos concluídos (0 a 100). */
export const percentualConcluido = (feitos: number, total: number): number => (total === 0 ? 0 : Math.round((feitos / total) * 100));
