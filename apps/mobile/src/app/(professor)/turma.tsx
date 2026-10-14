import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { formatarData, modulos, percentualConcluido, type AlunoApi } from '@sorriso/shared';
import { theme } from '../../constants/theme';
import { Aviso, Button, Campo, Caixa, Card, EstadoVazio, Progresso, Tela, Texto, Titulo } from '../../components/ui';
import { sync } from '../../lib/api';
import { useSessao } from '../../store/sessao';

function Detalhe({ aluno, turmaId, onFechar, onMudou }: { aluno: AlunoApi; turmaId: string; onFechar: () => void; onMudou: () => void }) {
  const [codigo, setCodigo] = useState<{ codigo: string; expiraEm: string } | null>(null);
  const [copiado, setCopiado] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: theme.semantic.fundo }}>
      <ScrollView contentContainerStyle={{ padding: theme.espaco(6), gap: theme.espaco(4) }}>
        <Titulo tamanho="2xl">{aluno.apelido}</Titulo>
        <Card>
          <Titulo tamanho="lg">Tarefas concluídas</Titulo>
          {modulos.map((m) => {
            const feito = aluno.modulosConcluidos.includes(m.id);
            return <Caixa key={m.id} marcado={feito} desabilitado={feito} rotulo={m.titulo} onChange={async () => { await sync.concluirModuloAluno(turmaId, aluno.id, m.id); onMudou(); }} />;
          })}
        </Card>
        <Card>
          <Titulo tamanho="lg">Acompanhamento da família (opcional)</Titulo>
          <Texto pequeno>Gere um código de uso único. A família vê só tarefas concluídas, dias escovando e estrelas.</Texto>
          {codigo ? (
            <>
              <Titulo tamanho="2xl" style={{ letterSpacing: 4 }}>{codigo.codigo.slice(0, 3)}-{codigo.codigo.slice(3)}</Titulo>
              <Texto pequeno>Vale até {formatarData(codigo.expiraEm)}</Texto>
              <Button variante="outline" icone="copiar" onPress={async () => { await Clipboard.setStringAsync(codigo.codigo); setCopiado(true); }}>{copiado ? 'Código copiado' : 'Copiar código'}</Button>
            </>
          ) : <Button icone="email" onPress={async () => setCodigo(await sync.gerarCodigoResponsavel(aluno.id))}>Gerar código para a família</Button>}
        </Card>
        <Button variante="outline" icone="voltar" onPress={onFechar}>Fechar</Button>
      </ScrollView>
    </View>
  );
}

export default function Turma() {
  const { turma } = useSessao();
  const [alunos, setAlunos] = useState<AlunoApi[] | null>(null);
  const [apelido, setApelido] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);
  const carregar = () => { if (turma) sync.alunosDaTurma(turma.id).then(setAlunos).catch(() => setAlunos([])); };
  useEffect(carregar, [turma?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!turma) return <Tela titulo="Turma"><EstadoVazio texto="Crie uma turma no Painel primeiro." /></Tela>;
  const atual = alunos?.find((a) => a.id === aberto) ?? null;
  return (
    <Tela titulo={`Alunos de ${turma.nome}`}>
      <Texto>Cada aluno aparece só por um apelido. Use a lista para acompanhar as tarefas e gerar o código da família.</Texto>
      <Card>
        <Campo rotulo="Novo aluno (apelido)" value={apelido} onChangeText={setApelido} maxLength={16} testID="campo-novo-aluno" />
        <Texto pequeno>Não use nome completo, sobrenome nem números de contato.</Texto>
        {erro && <Aviso texto={erro} />}
        <Button icone="mais" disabled={!apelido} onPress={async () => { setErro(null); try { await sync.adicionarAluno(turma.id, apelido); setApelido(''); carregar(); } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível adicionar.'); } }}>Adicionar</Button>
      </Card>
      {alunos?.length === 0 && <EstadoVazio texto="Nenhum aluno ainda." />}
      {(alunos ?? []).map((a) => (
        <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={`Abrir ${a.apelido}`} onPress={() => setAberto(a.id)}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Titulo tamanho="lg">{a.apelido}</Titulo><Texto negrito>{a.modulosConcluidos.length} de {modulos.length}</Texto></View>
            <Progresso valor={percentualConcluido(a.modulosConcluidos.length, modulos.length)} rotulo={`Tarefas de ${a.apelido}`} />
            <Texto pequeno>{a.diasEscovando} dias escovando · última atividade: {formatarData(a.ultimaAtividadeEm)}</Texto>
          </Card>
        </Pressable>
      ))}
      <Modal visible={atual !== null} animationType="slide" onRequestClose={() => setAberto(null)}>
        {atual && <Detalhe aluno={atual} turmaId={turma.id} onFechar={() => setAberto(null)} onMudou={carregar} />}
      </Modal>
    </Tela>
  );
}
