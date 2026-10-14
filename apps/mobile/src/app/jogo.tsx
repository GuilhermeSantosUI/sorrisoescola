import { useLocalSearchParams, useRouter } from 'expo-router';
import { EstadoVazio, Tela } from '../components/ui';
import { JogoAlimentos, JogoLimpeza } from '../components/atividades/jogos';
import { useModules } from '../lib/use-modules';

export default function Jogo() {
  const { modulo, i } = useLocalSearchParams<{ modulo: string; i: string }>();
  const router = useRouter();
  const a = useModules().find((m) => m.id === modulo)?.atividades[Number(i)];
  if (a?.tipo !== 'jogo') return <Tela voltar><EstadoVazio texto="Jogo não encontrado." /></Tela>;
  return <Tela voltar>{a.jogo === 'arrastar-dentes' ? <JogoLimpeza instrucao={a.instrucao} onFim={() => router.back()} /> : <JogoAlimentos instrucao={a.instrucao} onFim={() => router.back()} />}</Tela>;
}
