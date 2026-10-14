import { describe, expect, it } from 'vitest';
import { modulos, modulosPublicados } from '@sorriso/shared';

describe('mobile · conteúdo', () => {
  it('não exibe módulos sem validação da Odontologia', () => {
    expect(modulosPublicados(modulos)).toEqual([]);
  });
});
