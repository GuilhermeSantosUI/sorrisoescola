import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Aviso, Button, Campo, Card, Mascote, Tela, Texto } from '../components/ui';
import { sync } from '../lib/api';
import { definirPapel } from '../store/sessao';

export default function EntrarAluno() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [apelido, setApelido] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  async function entrar() {
    setErro(null);
    try { await sync.entrarCrianca(codigo, apelido); await definirPapel('crianca', { apelido: apelido.trim() }); router.replace('/inicio'); }
    catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível entrar.'); }
  }
  return (
    <Tela voltar titulo="Entrar (criança)">
      <Mascote pose="acenando" altura={150} decorativo />
      <Card>
        <Texto>Peça o código da turma ao professor. Use só um apelido, nunca seu nome completo.</Texto>
        <Campo rotulo="Código da turma" value={codigo} onChangeText={(t) => setCodigo(t.toUpperCase())} autoCapitalize="characters" maxLength={7} testID="campo-turma" />
        <Campo rotulo="Apelido" value={apelido} onChangeText={setApelido} maxLength={16} testID="campo-apelido" />
        {erro && <Aviso texto={erro} />}
        <Button icone="proximo" disabled={!codigo || !apelido} onPress={() => void entrar()}>Entrar</Button>
      </Card>
    </Tela>
  );
}
