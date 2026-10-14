import { Redirect, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { theme } from '../constants/theme';
import { Button, Card, Icone, Mascote, Tela, Texto, Titulo, type IconeNome } from '../components/ui';
import { ModoDemo } from '../components/sessao/modo-demo';
import { useSessao } from '../store/sessao';

const PERFIS: { rota: '/entrar-professor' | '/entrar-aluno' | '/entrar-responsavel'; icone: IconeNome; titulo: string; texto: string }[] = [
  { rota: '/entrar-professor', icone: 'professor', titulo: 'Sou professor(a)', texto: 'Conduza a aula pelo seu aparelho, acompanhe a turma e as tarefas de cada aluno.' },
  { rota: '/entrar-aluno', icone: 'sorriso', titulo: 'Sou criança', texto: 'Entre com o código da turma e um apelido para jogar e escovar com o mascote.' },
  { rota: '/entrar-responsavel', icone: 'familia', titulo: 'Sou responsável', texto: 'Acompanhe, se quiser, as tarefas e os dias escovando, com o mínimo de dados.' },
];

export default function Inicio() {
  const router = useRouter();
  const s = useSessao();
  if (s.pronto && s.papel === 'professor') return <Redirect href="/painel" />;
  if (s.pronto && s.papel === 'crianca') return <Redirect href="/inicio" />;
  if (s.pronto && s.papel === 'responsavel') return <Redirect href="/acompanhamento" />;
  return (
    <Tela>
      <View style={{ alignItems: 'center', gap: theme.espaco(2) }}>
        <Mascote pose="acenando" altura={190} decorativo />
        <Titulo tamanho="2xl" style={{ textAlign: 'center' }}>Sorriso na Escola</Titulo>
        <Texto style={{ textAlign: 'center' }}>Como você quer entrar?</Texto>
      </View>
      {PERFIS.map((p) => (
        <Pressable key={p.rota} accessibilityRole="button" accessibilityLabel={p.titulo} onPress={() => router.push(p.rota)}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: theme.espaco(4) }}>
            <View style={{ width: theme.espaco(14), height: theme.espaco(14), borderRadius: theme.radii.full, backgroundColor: theme.colors.turquesa, alignItems: 'center', justifyContent: 'center' }}><Icone nome={p.icone} size={30} /></View>
            <View style={{ flex: 1, gap: theme.espaco(1) }}><Titulo tamanho="lg">{p.titulo}</Titulo><Texto pequeno>{p.texto}</Texto></View>
          </Card>
        </Pressable>
      ))}
      <ModoDemo />
      <View style={{ flexDirection: 'row', gap: theme.espaco(3), justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variante="ghost" icone="ajuda" onPress={() => router.push('/ajuda')}>Ajuda</Button>
        <Button variante="ghost" icone="marca" onPress={() => router.push('/marca')}>Marca</Button>
      </View>
    </Tela>
  );
}

