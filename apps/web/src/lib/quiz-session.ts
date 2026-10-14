import { useState } from 'react';
import { calcularResultado, type Pergunta, type Resposta } from '@sorriso/shared';

/** Quiz coletivo: o professor registra a resposta da turma, sem limite de tempo. */
export function useQuizSession(perguntas: Pergunta[]) {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [inicio] = useState(() => Date.now());
  const fim = indice >= perguntas.length;
  return {
    indice,
    pergunta: perguntas[indice] ?? null,
    fim,
    responder(escolha: number) {
      const p = perguntas[indice];
      if (!p) return;
      setRespostas((r) => [...r, { perguntaId: p.id, escolha }]);
      setIndice((i) => i + 1);
    },
    resultado: () => calcularResultado(perguntas, respostas),
    duracaoSegundos: () => Math.round((Date.now() - inicio) / 1000),
  };
}
