import type { Atividade, Modulo, Pergunta } from './types';

export function validarPergunta(p: Pergunta): string[] {
  const erros: string[] = [];
  if (!p.enunciado.trim()) erros.push(`${p.id}: enunciado vazio`);
  if (p.opcoes.length < 2) erros.push(`${p.id}: precisa de ao menos 2 opções`);
  if (!Number.isInteger(p.correta) || p.correta < 0 || p.correta >= p.opcoes.length)
    erros.push(`${p.id}: índice da resposta correta fora do intervalo`);
  return erros;
}

function validarAtividade(a: Atividade, moduloId: string): string[] {
  switch (a.tipo) {
    case 'quiz':
      return a.perguntas.length === 0
        ? [`${moduloId}: quiz sem perguntas`]
        : a.perguntas.flatMap(validarPergunta);
    case 'tutorial':
      return a.passos.length === 0 ? [`${moduloId}: tutorial sem passos`] : [];
    case 'video':
      return a.legendas ? [] : [`${moduloId}: vídeo sem legendas (obrigatório)`];
    case 'jogo':
      return [];
  }
}

/** Valida a estrutura do módulo (não a validação odontológica). */
export function validarModulo(m: Modulo): string[] {
  const erros = m.atividades.flatMap((a) => validarAtividade(a, m.id));
  if (!m.id.trim()) erros.push('módulo sem id');
  if (m.atividades.length === 0) erros.push(`${m.id}: sem atividades`);
  if (m.validadoPor && !m.validadoEm) erros.push(`${m.id}: validadoPor sem validadoEm`);
  if (m.validadoEm && Number.isNaN(Date.parse(m.validadoEm))) erros.push(`${m.id}: validadoEm inválido`);
  return erros;
}

/** Conteúdo sem validação da Odontologia não aparece. */
export function estaValidado(m: Modulo): boolean {
  return Boolean(m.validadoPor?.trim()) && Boolean(m.validadoEm) && !Number.isNaN(Date.parse(m.validadoEm!));
}

export function modulosPublicados(modulos: Modulo[], opts: { incluirNaoValidados?: boolean } = {}): Modulo[] {
  return modulos.filter((m) => validarModulo(m).length === 0 && (opts.incluirNaoValidados || estaValidado(m)));
}
