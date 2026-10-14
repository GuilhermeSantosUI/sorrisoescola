import { useLocalSearchParams } from 'expo-router';
import { EstadoVazio, Tela } from '../components/ui';
import { VideoAviso } from '../components/atividades/video';
import { useModules } from '../lib/use-modules';

export default function Video() {
  const { modulo, i } = useLocalSearchParams<{ modulo: string; i: string }>();
  const a = useModules().find((m) => m.id === modulo)?.atividades[Number(i)];
  return <Tela voltar>{a?.tipo === 'video' ? <VideoAviso titulo={a.titulo} /> : <EstadoVazio texto="Vídeo não encontrado." />}</Tela>;
}
