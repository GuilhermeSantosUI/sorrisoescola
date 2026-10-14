import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { formatarData, modulos, percentualConcluido, type AcompanhamentoApi } from '@sorriso/shared';
import { borda, theme } from '../../constants/theme';
import { Button, Card, EstadoVazio, Icone, Mascote, Progresso, Tela, Texto, Titulo } from '../../components/ui';
import { sync } from '../../lib/api';
import { encerrarSessao } from '../../store/sessao';

export default function Acompanhamento() {
  const router = useRouter();
  const [d, setD] = useState<AcompanhamentoApi | null | undefined>(undefined);
  useEffect(() => { sync.acompanhamento().then(setD).catch(() => setD(null)); }, []);
  const sair = async () => { try { await sync.revogarVinculo(); } catch { /* segue encerrando localmente */ } await encerrarSessao(); router.replace('/'); };
  if (d === undefined) return <Tela titulo="Acompanhamento"><Texto>Carregando…</Texto></Tela>;
  if (d === null) return <Tela titulo="Acompanhamento"><EstadoVazio ilustracao="dente-triste" texto="Não encontramos um acompanhamento ativo." /><Button icone="entrar" onPress={() => router.replace('/entrar-responsavel')}>Entrar com um código</Button></Tela>;
  const pct = percentualConcluido(d.modulosConcluidos.length, d.totalModulos);
  return (
    <Tela>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: theme.espaco(3) }}>
        <Mascote pose={pct >= 50 ? 'joinha' : 'acenando'} altura={120} decorativo />
        <View style={{ flex: 1 }}><Texto negrito>Acompanhando</Texto><Titulo tamanho="2xl">{d.apelido}</Titulo></View>
      </View>
      <Card>
        <Titulo tamanho="lg">Tarefas concluídas: {d.modulosConcluidos.length} de {d.totalModulos}</Titulo>
        <Progresso valor={pct} rotulo="Tarefas concluídas" />
        {modulos.map((m) => {
          const feito = d.modulosConcluidos.includes(m.id);
          return (
            <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.espaco(2), opacity: feito ? 1 : 0.6 }}>
              <View style={{ width: theme.espaco(7), height: theme.espaco(7), borderRadius: theme.radii.full, borderWidth: borda, borderColor: theme.colors.petroleo, backgroundColor: feito ? theme.colors.limao : theme.colors.branco, alignItems: 'center', justifyContent: 'center' }}>{feito && <Icone nome="ok" size={16} />}</View>
              <Texto style={{ flex: 1 }}>{m.titulo}</Texto>
            </View>
          );
        })}
      </Card>
      <View style={{ flexDirection: 'row', gap: theme.espaco(3) }}>
        <Card style={{ flex: 1, alignItems: 'center' }}><Titulo tamanho="2xl">{d.diasEscovando}</Titulo><Texto pequeno style={{ textAlign: 'center' }}>dias escovando</Texto></Card>
        <Card style={{ flex: 1, alignItems: 'center' }}><Titulo tamanho="2xl">{d.sequenciaDias}</Titulo><Texto pequeno style={{ textAlign: 'center' }}>dias seguidos</Texto></Card>
        <Card style={{ flex: 1, alignItems: 'center' }}><Titulo tamanho="2xl">{d.estrelas}</Titulo><Texto pequeno style={{ textAlign: 'center' }}>estrelas</Texto></Card>
      </View>
      <Texto pequeno>Última atividade: {formatarData(d.ultimaAtividadeEm)}. Acompanhamento autorizado em {formatarData(d.consentimentoEm)}.</Texto>
      <Button variante="outline" icone="sair" onPress={() => void sair()}>Encerrar acompanhamento</Button>
    </Tela>
  );
}
