import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Atividade } from '@sorriso/shared';
import { theme } from '../../constants/theme';
import { Button, Card, EstadoVazio, Ilustracao, Tela, Texto, Titulo, type IconeNome } from '../../components/ui';
import { useModules } from '../../lib/use-modules';

const ROTULO: Record<Atividade['tipo'], IconeNome> = { video: 'play', tutorial: 'sorriso', jogo: 'brilho', quiz: 'estrela' };

export default function Modulo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const m = useModules().find((x) => x.id === id);
  if (!m) return <Tela voltar titulo="Módulo"><EstadoVazio texto="Módulo não encontrado." /></Tela>;
  return (
    <Tela voltar>
      <View style={{ flexDirection: 'row', gap: theme.espaco(3), alignItems: 'center' }}>
        <Ilustracao nome="dente-feliz" tamanho={72} /><Titulo tamanho="2xl" style={{ flex: 1 }}>{m.titulo}</Titulo>
      </View>
      <Texto>{m.resumo}</Texto>
      <Card>
        {m.atividades.map((a, i) => <Button key={i} variante="outline" icone={ROTULO[a.tipo]} onPress={() => router.push(`/${a.tipo}?modulo=${m.id}&i=${i}`)}>{a.titulo}</Button>)}
      </Card>
    </Tela>
  );
}
