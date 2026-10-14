import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Aviso, Button, Campo, Card, Tela, Texto } from '../components/ui';
import { carregarDemo, usandoMock } from '../lib/demo';
import { sync } from '../lib/api';
import { definirPapel } from '../store/sessao';

export default function EntrarProfessor() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setErro(null); setCarregando(true);
    try {
      if (!enviado) { await sync.solicitarCodigoProfessor(email); setEnviado(true); return; }
      await sync.entrarProfessor(email, codigo);
      const turma = usandoMock ? { ...(await carregarDemo()).TURMA_DEMO } : null;
      await definirPapel('professor', { turma });
      router.replace('/painel');
    } catch (e) { setErro(e instanceof Error && e.message ? e.message : 'Não foi possível entrar. Tente de novo.'); }
    finally { setCarregando(false); }
  }
  return (
    <Tela voltar titulo="Entrar (professor)">
      <Card>
        <Texto>Use seu e-mail. Enviaremos um código de 6 dígitos.</Texto>
        <Campo rotulo="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!enviado} testID="campo-email" />
        {enviado && <Campo rotulo="Código de 6 dígitos" value={codigo} onChangeText={setCodigo} keyboardType="number-pad" maxLength={6} testID="campo-codigo" />}
        {erro && <Aviso texto={erro} />}
        <Button icone={enviado ? 'entrar' : 'email'} disabled={carregando || !email} onPress={() => void enviar()}>{carregando ? 'Aguarde…' : enviado ? 'Entrar' : 'Receber código'}</Button>
      </Card>
      <Texto pequeno>Sem dados de crianças nesta etapa: guardamos só seu nome e e-mail.</Texto>
    </Tela>
  );
}
