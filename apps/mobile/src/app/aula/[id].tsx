import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { resultadoParaApi, type Atividade } from '@sorriso/shared';
import { borda, theme } from '../../constants/theme';
import { Button, EstadoVazio, Mascote, Tela, Texto, Titulo } from '../../components/ui';
import { JogoAlimentos, JogoLimpeza } from '../../components/atividades/jogos';
import { Passos } from '../../components/atividades/passos';
import { Quiz } from '../../components/atividades/quiz';
import { VideoAviso } from '../../components/atividades/video';
import { sync } from '../../lib/api';
import { useModules } from '../../lib/use-modules';

const ORDEM: Atividade['tipo'][] = ['video', 'tutorial', 'jogo', 'quiz'];

/** Aula guiada: o professor segura o aparelho e mostra à turma. Letras grandes, uma ação por tela. */
export default function Aula() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const m = useModules().find((x) => x.id === id);
  const etapas = useMemo(() => (m ? ORDEM.flatMap((t) => m.atividades.filter((a) => a.tipo === t)) : []), [m]);
  const [i, setI] = useState(0);
  if (!m) return <Tela voltar><EstadoVazio texto="Módulo não encontrado." /></Tela>;
  const atual = etapas[i];
  const avancar = () => setI((v) => Math.min(v + 1, etapas.length));

  return (
    <Tela voltar titulo={m.titulo}>
      <View accessibilityRole="progressbar" accessibilityLabel={`Etapa ${i + 1} de ${etapas.length}`} style={{ flexDirection: 'row', gap: theme.espaco(2), justifyContent: 'center' }}>
        {etapas.map((_, k) => <View key={k} style={{ width: theme.espaco(4), height: theme.espaco(4), borderRadius: theme.radii.full, borderWidth: borda, borderColor: theme.colors.petroleo, backgroundColor: k < i ? theme.colors.turquesa : k === i ? theme.colors.amareloLimao : theme.colors.branco }} />)}
      </View>
      {!atual ? (
        <View style={{ alignItems: 'center', gap: theme.espaco(4) }}>
          <Mascote pose="joinha" altura={220} decorativo />
          <Titulo tamanho="2xl" style={{ textAlign: 'center' }}>Muito bem, turma!</Titulo>
          <Button tamanho="lg" icone="casa" onPress={() => router.replace('/conduzir')}>Escolher outro módulo</Button>
        </View>
      ) : (
        <>
          {atual.tipo === 'video' && <VideoAviso titulo={atual.titulo} />}
          {atual.tipo === 'tutorial' && <Passos grande passos={atual.passos} onFim={avancar} />}
          {atual.tipo === 'jogo' && (atual.jogo === 'arrastar-dentes' ? <JogoLimpeza instrucao={atual.instrucao} onFim={avancar} /> : <JogoAlimentos instrucao={atual.instrucao} onFim={avancar} />)}
          {atual.tipo === 'quiz' && <Quiz modo="turma" perguntas={atual.perguntas} onFim={(r, s) => { void sync.enviarQuiz(resultadoParaApi(m.id, m.tema, r, s)).catch(() => undefined); avancar(); }} />}
          {atual.tipo !== 'quiz' && atual.tipo !== 'tutorial' && atual.tipo !== 'jogo' && <Button tamanho="lg" icone="proximo" onPress={avancar}>Avançar</Button>}
          {atual.tipo === 'video' && <Texto pequeno style={{ textAlign: 'center' }}>Dica: mostre a tela para a turma e leia junto com os alunos.</Texto>}
        </>
      )}
    </Tela>
  );
}
