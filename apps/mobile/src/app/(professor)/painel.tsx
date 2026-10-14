import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { mediaGeral, resumoPorTema, type RespostaQuizApi } from '@sorriso/shared';
import { theme } from '../../constants/theme';
import { Aviso, Badge, Button, Campo, Card, EstadoVazio, Progresso, Tela, Texto, Titulo } from '../../components/ui';
import { sync } from '../../lib/api';
import { definirTurma, encerrarSessao, useSessao } from '../../store/sessao';

export default function Painel() {
  const router = useRouter();
  const { turma } = useSessao();
  const [rows, setRows] = useState<RespostaQuizApi[] | null>(null);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => { if (turma) sync.resultadosDaTurma(turma.id).then(setRows).catch(() => setRows([])); }, [turma?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function criar() {
    setErro(null);
    try { await definirTurma(await sync.criarTurma(nome)); } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível criar a turma.'); }
  }
  const temas = rows ? resumoPorTema(rows).sort((a, b) => a.percentual - b.percentual) : [];

  return (
    <Tela titulo="Painel do professor">
      {!turma ? (
        <Card>
          <Titulo tamanho="lg">Crie sua turma</Titulo>
          <Texto>Você receberá um código para os alunos e as famílias.</Texto>
          <Campo rotulo="Nome da turma" value={nome} onChangeText={setNome} placeholder="Ex.: 5º Ano B" />
          {erro && <Aviso texto={erro} />}
          <Button icone="mais" disabled={!nome} onPress={() => void criar()}>Criar turma e gerar código</Button>
        </Card>
      ) : (
        <>
          <Card>
            <Texto negrito>{turma.nome}</Texto>
            <Titulo tamanho="3xl" style={{ letterSpacing: 4 }}>{turma.codigo.slice(0, 3)}-{turma.codigo.slice(3)}</Titulo>
            <Texto pequeno>Código da turma para as crianças entrarem no app.</Texto>
            <Button variante="outline" icone="copiar" onPress={async () => { await Clipboard.setStringAsync(turma.codigo); setCopiado(true); }}>{copiado ? 'Código copiado' : 'Copiar código'}</Button>
          </Card>
          <View style={{ gap: theme.espaco(3) }}>
            <Button tamanho="lg" icone="sala" onPress={() => router.push('/conduzir')}>Conduzir aula</Button>
            <Button variante="outline" icone="alunos" onPress={() => router.push('/turma')}>Alunos e tarefas</Button>
          </View>
          <View style={{ flexDirection: 'row', gap: theme.espaco(3) }}>
            <Card style={{ flex: 1, alignItems: 'center' }}><Titulo tamanho="2xl">{rows?.length ?? 0}</Titulo><Texto pequeno style={{ textAlign: 'center' }}>quizzes respondidos</Texto></Card>
            <Card style={{ flex: 1, alignItems: 'center' }}><Titulo tamanho="2xl">{rows ? mediaGeral(rows) : 0}%</Titulo><Texto pequeno style={{ textAlign: 'center' }}>média de acertos</Texto></Card>
          </View>
          <Card>
            <Titulo tamanho="lg">Acertos por tema</Titulo>
            {temas.length === 0 ? <EstadoVazio texto="Ainda não há resultados. Conduza um quiz!" /> : temas.map((t) => (
              <View key={t.tema} style={{ gap: theme.espaco(1) }}><Texto negrito>{t.nome}: {t.percentual}%</Texto><Progresso valor={t.percentual} rotulo={`Acertos em ${t.nome}`} /></View>
            ))}
            {temas[0] && <Badge variante="secondary">{`Atenção: ${temas[0].nome}`}</Badge>}
          </Card>
        </>
      )}
      <Button variante="ghost" icone="sair" onPress={async () => { await encerrarSessao(); router.replace('/'); }}>Sair</Button>
    </Tela>
  );
}
