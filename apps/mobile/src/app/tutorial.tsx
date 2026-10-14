import { useLocalSearchParams, useRouter } from 'expo-router';
import { EstadoVazio, Tela } from '../components/ui';
import { Passos } from '../components/atividades/passos';
import { useModules } from '../lib/use-modules';

export default function Tutorial() {
  const { modulo, i } = useLocalSearchParams<{ modulo: string; i: string }>();
  const router = useRouter();
  const a = useModules().find((m) => m.id === modulo)?.atividades[Number(i)];
  return <Tela voltar>{a?.tipo === 'tutorial' ? <Passos passos={a.passos} onFim={() => router.back()} /> : <EstadoVazio texto="Passo a passo não encontrado." />}</Tela>;
}
