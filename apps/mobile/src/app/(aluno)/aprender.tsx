import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Badge, Button, Card, EstadoVazio, Ilustracao, Tela, Texto, Titulo } from '../../components/ui';
import { useModules } from '../../lib/use-modules';

export default function Aprender() {
  const router = useRouter();
  const modulos = useModules();
  return (
    <Tela titulo="Aprender">
      {modulos.length === 0 && <EstadoVazio texto="Nenhum módulo validado ainda." />}
      {modulos.map((m) => (
        <Card key={m.id}>
          <View style={{ flexDirection: 'row', gap: theme.espaco(3), alignItems: 'center' }}>
            <Ilustracao nome={m.tema === 'alimentacao-carie' ? 'dente-sujo' : 'dente-feliz'} tamanho={64} />
            <View style={{ flex: 1, gap: theme.espaco(1) }}><Titulo tamanho="lg">{m.titulo}</Titulo><Badge variante="outline">{`${m.atividades.length} atividades`}</Badge></View>
          </View>
          <Texto pequeno>{m.resumo}</Texto>
          <Button icone="play" onPress={() => router.push(`/modulo/${m.id}`)}>Abrir</Button>
        </Card>
      ))}
    </Tela>
  );
}
