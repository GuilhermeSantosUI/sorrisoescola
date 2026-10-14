import { useState } from 'react';
import { View } from 'react-native';
import { calcularResultado, estrelas, type Pergunta, type ResultadoQuiz, type Resposta } from '@sorriso/shared';
import { theme } from '../../constants/theme';
import { Button, Card, Mascote, Texto, Titulo, Progresso } from '../ui';
import { Estrelas } from './estrelas';

/**
 * Quiz sem limite de tempo. modo "turma": o professor registra a resposta da turma (letras grandes);
 * modo "aluno": a criança responde no aparelho. Mesma regra de pontuação do shared.
 */
export function Quiz({ perguntas, modo, onFim }: { perguntas: Pergunta[]; modo: 'turma' | 'aluno'; onFim?: (r: ResultadoQuiz, segundos: number) => void }) {
  const [i, setI] = useState(0);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [inicio] = useState(() => Date.now());
  const p = perguntas[i];

  if (!p) {
    const r = calcularResultado(perguntas, respostas);
    const e = estrelas(r.pontuacao);
    return (
      <Card style={{ alignItems: 'center' }}>
        <Mascote pose={e >= 2 ? 'comemorando' : 'pensando'} altura={180} decorativo />
        <Titulo tamanho="xl" style={{ textAlign: 'center' }}>{modo === 'turma' ? 'A turma' : 'Você'} acertou {r.acertos} de {r.total}!</Titulo>
        <Estrelas ganhas={e} />
        {onFim && <Button icone="proximo" onPress={() => onFim(r, Math.round((Date.now() - inicio) / 1000))}>Continuar</Button>}
      </Card>
    );
  }
  const grande = modo === 'turma';
  return (
    <View style={{ gap: theme.espaco(4) }}>
      <Progresso valor={(i / perguntas.length) * 100} rotulo={`Pergunta ${i + 1} de ${perguntas.length}`} />
      <Texto negrito>Pergunta {i + 1} de {perguntas.length}</Texto>
      <Titulo tamanho={grande ? '2xl' : 'xl'}>{p.enunciado}</Titulo>
      <View style={{ gap: theme.espaco(3) }}>
        {p.opcoes.map((o, k) => (
          <Button key={o} variante="outline" tamanho={grande ? 'lg' : 'default'} icone={String(k + 1)} onPress={() => { setRespostas((r) => [...r, { perguntaId: p.id, escolha: k }]); setI(i + 1); }}>{o}</Button>
        ))}
      </View>
    </View>
  );
}
