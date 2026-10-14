import { describe, expect, it } from 'vitest';
import { createMockFetch, DEMO } from './index';
import { createApiClient, createSync, type Tokens } from '../index';

function sync() {
  let tokens: Tokens | null = null;
  const store = { get: async () => tokens, set: async (t: Tokens | null) => { tokens = t; } };
  return createSync(createApiClient({ baseUrl: 'http://api.test', tokens: store, fetch: createMockFetch(0) }), store);
}

describe('API simulada (demo)', () => {
  it('professor: código errado falha, certo entra', async () => {
    const s = sync();
    await expect(s.entrarProfessor('a@b.com', '000000')).rejects.toThrow();
    await s.entrarProfessor('a@b.com', DEMO.codigoProfessor);
    expect(await s.temSessao()).toBe(true);
  });

  it('turma tem alunos só com apelido e permite registrar tarefa', async () => {
    const s = sync();
    const alunos = await s.alunosDaTurma('qualquer');
    expect(alunos.length).toBeGreaterThan(10);
    expect(alunos.every((a) => !/@|\d{5,}/.test(a.apelido))).toBe(true);
    await expect(s.adicionarAluno('t', 'Maria da Silva Souza')).rejects.toThrow(); // nome completo recusado
    const novo = await s.adicionarAluno('t', 'Zeca');
    await s.concluirModuloAluno('t', novo.id, 'escovacao');
    const depois = (await s.alunosDaTurma('t')).find((a) => a.id === novo.id);
    expect(depois?.modulosConcluidos).toContain('escovacao');
  });

  it('responsável: exige consentimento e vê só o resumo mínimo', async () => {
    const s = sync();
    await expect(s.entrarResponsavel(DEMO.codigoResponsavel, false)).rejects.toThrow(/concordar/);
    await s.entrarResponsavel(DEMO.codigoResponsavel, true);
    const a = await s.acompanhamento();
    expect(Object.keys(a).sort()).toEqual(['apelido', 'consentimentoEm', 'diasEscovando', 'estrelas', 'modulosConcluidos', 'sequenciaDias', 'totalModulos', 'ultimaAtividadeEm'].sort());
    await s.revogarVinculo();
    expect(await s.temSessao()).toBe(false);
  });
});
