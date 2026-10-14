import { TEMAS, type Pergunta, type Resposta, type Tema } from './types';

export interface ResultadoQuiz {
  acertos: number;
  total: number;
  /** 0 a 100 inteiro */
  pontuacao: number;
  estrelas: 0 | 1 | 2 | 3;
  porTema: Partial<Record<Tema, { acertos: number; total: number }>>;
}

export function calcularResultado(perguntas: Pergunta[], respostas: Resposta[]): ResultadoQuiz {
  const porId = new Map(respostas.map((r) => [r.perguntaId, r.escolha]));
  const porTema: ResultadoQuiz['porTema'] = {};
  let acertos = 0;
  for (const p of perguntas) {
    const t = (porTema[p.tema] ??= { acertos: 0, total: 0 });
    t.total++;
    if (porId.get(p.id) === p.correta) {
      acertos++;
      t.acertos++;
    }
  }
  const total = perguntas.length;
  const pontuacao = total === 0 ? 0 : Math.round((acertos / total) * 100);
  return { acertos, total, pontuacao, estrelas: estrelas(pontuacao), porTema };
}

export function estrelas(pontuacao: number): 0 | 1 | 2 | 3 {
  if (pontuacao >= 90) return 3;
  if (pontuacao >= 60) return 2;
  if (pontuacao > 0) return 1;
  return 0;
}

export interface Conquista {
  id: string;
  titulo: string;
}

export function conquistas(resultados: ResultadoQuiz[]): Conquista[] {
  const out: Conquista[] = [];
  if (resultados.length >= 1) out.push({ id: 'primeiro-quiz', titulo: 'Primeiro quiz!' });
  if (resultados.some((r) => r.estrelas === 3)) out.push({ id: 'tres-estrelas', titulo: 'Três estrelas' });
  if (resultados.some((r) => r.total > 0 && r.acertos === r.total)) out.push({ id: 'gabarito', titulo: 'Gabaritou!' });
  return out;
}

export interface ResultadoTurma {
  tentativas: number;
  mediaPontuacao: number;
  porTema: { tema: Tema; nome: string; percentualAcerto: number }[];
}

export function resultadoDaTurma(resultados: ResultadoQuiz[]): ResultadoTurma {
  const tentativas = resultados.length;
  const mediaPontuacao = tentativas === 0 ? 0 : Math.round(resultados.reduce((s, r) => s + r.pontuacao, 0) / tentativas);
  const acc = new Map<Tema, { a: number; t: number }>();
  for (const r of resultados)
    for (const [tema, v] of Object.entries(r.porTema) as [Tema, { acertos: number; total: number }][]) {
      const cur = acc.get(tema) ?? { a: 0, t: 0 };
      acc.set(tema, { a: cur.a + v.acertos, t: cur.t + v.total });
    }
  const porTema = [...acc].map(([tema, { a, t }]) => ({
    tema,
    nome: TEMAS[tema],
    percentualAcerto: t === 0 ? 0 : Math.round((a / t) * 100),
  }));
  return { tentativas, mediaPontuacao, porTema };
}
