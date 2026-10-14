/** Questionário de acompanhamento, aplicado uma semana depois da intervenção. */
export interface PerguntaFeedback {
  id: string;
  texto: string;
  opcoes: string[];
}

export const PERGUNTAS_FEEDBACK: PerguntaFeedback[] = [
  { id: 'usou-app', texto: 'Você usou o aplicativo depois da aula?', opcoes: ['Sim, várias vezes', 'Sim, uma vez', 'Não'] },
  { id: 'escovacao', texto: 'Você está escovando os dentes do jeito que aprendeu?', opcoes: ['Sempre', 'Às vezes', 'Ainda não'] },
  { id: 'fio-dental', texto: 'Você usou fio dental esta semana?', opcoes: ['Todo dia', 'Alguns dias', 'Não usei'] },
  { id: 'gostou', texto: 'Você gostou do aplicativo?', opcoes: ['Gostei muito', 'Gostei', 'Não gostei'] },
];

export function validarRespostasFeedback(r: Record<string, string>): boolean {
  return PERGUNTAS_FEEDBACK.every((p) => {
    const v = r[p.id];
    return v !== undefined && p.opcoes.includes(v);
  });
}
