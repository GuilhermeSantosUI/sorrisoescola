import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { Aviso, Button, Campo, Caixa, Card, Icone, Tela, Texto, Titulo } from '../components/ui';
import { sync } from '../lib/api';
import { definirPapel } from '../store/sessao';

const VE = ['Tarefas concluídas', 'Dias escovando e sequência', 'Estrelas conquistadas', 'Data da última atividade'];
const NAO_VE = ['Respostas individuais do quiz', 'Outros alunos da turma', 'Nome completo, foto ou localização'];

export default function EntrarResponsavel() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [aceito, setAceito] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  async function entrar() {
    setErro(null);
    try { await sync.entrarResponsavel(codigo, aceito); await definirPapel('responsavel'); router.replace('/acompanhamento'); }
    catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível entrar.'); }
  }
  return (
    <Tela voltar titulo="Acompanhamento da família">
      <Texto>Opcional e com o mínimo de dados. O professor gera um código para você ver como seu filho ou sua filha está avançando.</Texto>
      <Card>
        <Titulo tamanho="lg">O que você vê</Titulo>
        {VE.map((t) => <View key={t} style={{ flexDirection: 'row', gap: theme.espaco(2), alignItems: 'center' }}><Icone nome="ok" size={20} /><Texto>{t}</Texto></View>)}
        <Titulo tamanho="lg">O que não aparece</Titulo>
        {NAO_VE.map((t) => <View key={t} style={{ flexDirection: 'row', gap: theme.espaco(2), alignItems: 'center' }}><Icone nome="proibido" size={20} /><Texto>{t}</Texto></View>)}
        <Texto pequeno>Não pedimos seu e-mail nem seus dados. Você pode encerrar a qualquer momento.</Texto>
      </Card>
      <Card>
        <Campo rotulo="Código de acompanhamento" value={codigo} onChangeText={(t) => setCodigo(t.toUpperCase())} autoCapitalize="characters" maxLength={7} testID="campo-responsavel" />
        <Caixa marcado={aceito} onChange={setAceito} rotulo="Concordo em acompanhar apenas o resumo acima e entendo que posso encerrar quando quiser." />
        {erro && <Aviso texto={erro} />}
        <Button icone="entrar" disabled={!codigo || !aceito} onPress={() => void entrar()}>Acompanhar</Button>
      </Card>
    </Tela>
  );
}
