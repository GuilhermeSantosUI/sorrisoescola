import { describe, expect, it } from 'vitest';
import { estaValidado, modulosPublicados, validarModulo } from './content';
import { modulos } from './data/modules';
import type { Modulo } from './types';

const base = modulos[0]!;
const validado: Modulo = { ...base, validadoPor: 'Fulana (Odontologia)', validadoEm: '2026-10-01' };

describe('content', () => {
  it('módulos versionados têm estrutura válida', () => {
    for (const m of modulos) expect(validarModulo(m)).toEqual([]);
  });
  it('conteúdo sem validação não aparece', () => {
    expect(modulosPublicados(modulos)).toEqual([]);
    expect(modulosPublicados([validado])).toHaveLength(1);
  });
  it('flag de pré-visualização inclui não validados', () => {
    expect(modulosPublicados(modulos, { incluirNaoValidados: true })).toHaveLength(modulos.length);
  });
  it('exige validadoEm junto com validadoPor', () => {
    expect(estaValidado({ ...validado, validadoEm: null })).toBe(false);
    expect(validarModulo({ ...validado, validadoEm: null })).not.toEqual([]);
  });
  it('detecta pergunta com resposta fora do intervalo', () => {
    const ruim: Modulo = { ...base, atividades: [{ tipo: 'quiz', titulo: 'q', perguntas: [{ id: 'x', tema: 'escovacao', enunciado: 'e', opcoes: ['a', 'b'], correta: 5 }] }] };
    expect(validarModulo(ruim)).not.toEqual([]);
  });
});
