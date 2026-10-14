import { calcularResultado, type Pergunta, type Resposta } from '@sorriso/shared';

/** Regra de pontuação mora no shared; aqui só o estado de uma partida. */
export function novaPartida(perguntas: Pergunta[]) {
  const respostas: Resposta[] = [];
  const inicio = Date.now();
  return {
    responder: (perguntaId: string, escolha: number) => void respostas.push({ perguntaId, escolha }),
    resultado: () => calcularResultado(perguntas, respostas),
    duracaoSegundos: () => Math.round((Date.now() - inicio) / 1000),
  };
}
