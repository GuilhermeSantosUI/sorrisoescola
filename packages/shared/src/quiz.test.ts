import { describe, expect, it } from 'vitest';
import { calcularResultado, estrelas, resultadoDaTurma, conquistas } from './quiz';
import type { Pergunta } from './types';

const ps: Pergunta[] = [
  { id: 'a', tema: 'escovacao', enunciado: '?', opcoes: ['x', 'y'], correta: 0 },
  { id: 'b', tema: 'dentista', enunciado: '?', opcoes: ['x', 'y'], correta: 1 },
];

describe('quiz', () => {
  it('calcula acertos e por tema', () => {
    const r = calcularResultado(ps, [{ perguntaId: 'a', escolha: 0 }, { perguntaId: 'b', escolha: 0 }]);
    expect(r).toMatchObject({ acertos: 1, total: 2, pontuacao: 50, estrelas: 1 });
    expect(r.porTema.escovacao).toEqual({ acertos: 1, total: 1 });
  });
  it('pergunta sem resposta conta como erro', () => expect(calcularResultado(ps, []).acertos).toBe(0));
  it('estrelas', () => {
    expect([estrelas(0), estrelas(10), estrelas(60), estrelas(90)]).toEqual([0, 1, 2, 3]);
  });
  it('resultado da turma e conquistas', () => {
    const r = calcularResultado(ps, [{ perguntaId: 'a', escolha: 0 }, { perguntaId: 'b', escolha: 1 }]);
    expect(resultadoDaTurma([r, calcularResultado(ps, [])]).mediaPontuacao).toBe(50);
    expect(conquistas([r]).map((c) => c.id)).toContain('gabarito');
  });
});
