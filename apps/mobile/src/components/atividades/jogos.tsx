import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Carrot, Cake, Cookie, Drop, IceCream, Orange, type IconProps } from 'phosphor-react-native';
import type { ComponentType } from 'react';
import { borda, theme } from '../../constants/theme';
import { Button, Card, Ilustracao, Texto, Titulo } from '../ui';

/** Caça às bolhas: limpe todos os dentinhos tocando neles. Sem tempo limite. */
export function JogoLimpeza({ instrucao, onFim }: { instrucao: string; onFim?: () => void }) {
  const TOTAL = 8;
  const [limpos, setLimpos] = useState<boolean[]>(() => Array(TOTAL).fill(false));
  const feitos = limpos.filter(Boolean).length;
  return (
    <Card style={{ alignItems: 'center' }}>
      <Titulo tamanho="xl">Caça às bolhas</Titulo>
      <Texto style={{ textAlign: 'center' }}>{instrucao}</Texto>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: theme.espaco(2) }}>
        {limpos.map((ok, i) => (
          <Pressable key={i} accessibilityRole="button" accessibilityLabel={ok ? `Dente ${i + 1} limpo` : `Limpar dente ${i + 1}`} onPress={() => setLimpos((l) => l.map((v, j) => (j === i ? true : v)))}
            style={{ width: theme.espaco(20), height: theme.espaco(20), borderRadius: theme.radii.lg, borderWidth: borda, borderColor: theme.colors.petroleo, backgroundColor: theme.colors.branco, alignItems: 'center', justifyContent: 'center' }}>
            <Ilustracao nome={ok ? 'dente-brilhando' : 'dente-sujo'} tamanho={56} />
          </Pressable>
        ))}
      </View>
      <Texto negrito accessibilityLiveRegion="polite">{feitos} de {TOTAL} dentes limpos</Texto>
      {feitos === TOTAL && onFim && <Button icone="proximo" onPress={onFim}>Continuar</Button>}
    </Card>
  );
}

const ALIMENTOS: { nome: string; Cmp: ComponentType<IconProps>; amigo: boolean; dica: string }[] = [
  { nome: 'Cenoura', Cmp: Carrot, amigo: true, dica: 'Crocante e cheia de vitaminas.' },
  { nome: 'Sorvete', Cmp: IceCream, amigo: false, dica: 'Muito açúcar: melhor de vez em quando.' },
  { nome: 'Laranja', Cmp: Orange, amigo: true, dica: 'Fruta! Mas escove depois, por causa da acidez.' },
  { nome: 'Biscoito recheado', Cmp: Cookie, amigo: false, dica: 'Gruda nos dentes e tem muito açúcar.' },
  { nome: 'Água', Cmp: Drop, amigo: true, dica: 'A melhor bebida para os dentes.' },
  { nome: 'Bolo', Cmp: Cake, amigo: false, dica: 'Doce: ótimo, mas com moderação.' },
]; // TODO: validar com Odontologia

/** Amigos e vilões: classifique os alimentos. */
export function JogoAlimentos({ instrucao, onFim }: { instrucao: string; onFim?: () => void }) {
  const [i, setI] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [resposta, setResposta] = useState<boolean | null>(null);
  const item = ALIMENTOS[i];
  if (!item) {
    return (
      <Card style={{ alignItems: 'center' }}>
        <Ilustracao nome="dente-brilhando" tamanho={120} />
        <Titulo tamanho="xl">Você acertou {acertos} de {ALIMENTOS.length}!</Titulo>
        {onFim && <Button icone="proximo" onPress={onFim}>Continuar</Button>}
      </Card>
    );
  }
  const { Cmp } = item;
  const escolher = (amigo: boolean) => { if (resposta !== null) return; const ok = amigo === item.amigo; setResposta(ok); if (ok) setAcertos((a) => a + 1); };
  return (
    <Card style={{ alignItems: 'center' }}>
      <Titulo tamanho="xl">Amigos e vilões</Titulo>
      <Texto style={{ textAlign: 'center' }}>{instrucao}</Texto>
      <Cmp size={88} weight="duotone" color={theme.semantic.texto} />
      <Titulo tamanho="lg">{item.nome}</Titulo>
      {resposta === null ? (
        <View style={{ gap: theme.espaco(3), alignSelf: 'stretch' }}>
          <Button icone="sorriso" onPress={() => escolher(true)}>Amigo do dente</Button>
          <Button variante="outline" icone="proibido" onPress={() => escolher(false)}>Vilão do dente</Button>
        </View>
      ) : (
        <View style={{ alignItems: 'center', gap: theme.espaco(2) }}>
          <Ilustracao nome={resposta ? 'dente-feliz' : 'dente-triste'} tamanho={80} />
          <Texto negrito style={{ textAlign: 'center' }}>{resposta ? 'Isso mesmo!' : 'Quase!'} {item.dica}</Texto>
          <Button icone="proximo" onPress={() => { setResposta(null); setI((v) => v + 1); }}>Próximo</Button>
        </View>
      )}
    </Card>
  );
}
