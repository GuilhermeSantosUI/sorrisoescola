import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Badge, Button, Card, EstadoVazio, Ilustracao, Tela, Texto, Titulo } from '../../components/ui';
import { useModules } from '../../lib/use-modules';

export default function Conduzir() {
  const router = useRouter();
  const modulos = useModules();
  return (
    <Tela titulo="Conduzir aula">
      <Texto>Escolha um módulo e mostre a tela do seu aparelho para a turma. Os alunos não precisam de celular.</Texto>
      {modulos.length === 0 && <EstadoVazio texto="Nenhum módulo validado ainda." />}
      {modulos.map((m) => (
        <Card key={m.id}>
          <View style={{ flexDirection: 'row', gap: theme.espaco(3), alignItems: 'center' }}>
            <Ilustracao nome={m.tema === 'alimentacao-carie' ? 'dente-sujo' : 'dente-feliz'} tamanho={64} />
            <View style={{ flex: 1, gap: theme.espaco(1) }}><Titulo tamanho="lg">{m.titulo}</Titulo><Badge variante="outline">{`${m.atividades.length} atividades`}</Badge></View>
          </View>
          <Texto pequeno>{m.resumo}</Texto>
          <Button icone="play" onPress={() => router.push(`/aula/${m.id}`)}>Conduzir</Button>
        </Card>
      ))}
    </Tela>
  );
}
