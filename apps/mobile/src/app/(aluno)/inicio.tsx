import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { proximoModulo, sequenciaDeDias, type ProgressoState, progressoVazio } from '@sorriso/shared';
import { theme } from '../../constants/theme';
import { Badge, Button, Card, EstadoVazio, Mascote, Tela, Texto, Titulo } from '../../components/ui';
import { useModules } from '../../lib/use-modules';
import { lerProgresso } from '../../store/progress';
import { encerrarSessao, useSessao } from '../../store/sessao';

export default function Inicio() {
  const router = useRouter();
  const { apelido } = useSessao();
  const modulos = useModules();
  const [progresso, setProgresso] = useState<ProgressoState>(progressoVazio());
  useEffect(() => { void lerProgresso().then(setProgresso); }, []);
  const proximo = proximoModulo(modulos, progresso);
  const dias = sequenciaDeDias(progresso.diasEscovando, new Date());
  return (
    <Tela>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: theme.espaco(3) }}>
        <Mascote pose="acenando" altura={130} decorativo />
        <View style={{ flex: 1, gap: theme.espaco(1) }}><Texto negrito>Olá,</Texto><Titulo tamanho="2xl">{apelido ?? 'amiguinho'}!</Titulo></View>
      </View>
      {proximo ? (
        <Card>
          <Badge variante="secondary">Próxima atividade</Badge>
          <Titulo tamanho="lg">{proximo.titulo}</Titulo>
          <Texto pequeno>{proximo.resumo}</Texto>
          <Button icone="play" onPress={() => router.push(`/modulo/${proximo.id}`)}>Começar</Button>
        </Card>
      ) : <EstadoVazio texto="Você concluiu todos os módulos disponíveis. Parabéns!" ilustracao="dente-brilhando" />}
      <View style={{ flexDirection: 'row', gap: theme.espaco(3) }}>
        <Card style={{ flex: 1, alignItems: 'center' }}><Titulo tamanho="2xl">{dias}</Titulo><Texto pequeno style={{ textAlign: 'center' }}>dias seguidos escovando</Texto></Card>
        <Card style={{ flex: 1, alignItems: 'center' }}><Titulo tamanho="2xl">{progresso.modulosConcluidos.length}</Titulo><Texto pequeno style={{ textAlign: 'center' }}>módulos concluídos</Texto></Card>
      </View>
      <Button variante="ghost" icone="sair" onPress={async () => { await encerrarSessao(); router.replace('/'); }}>Sair</Button>
    </Tela>
  );
}
