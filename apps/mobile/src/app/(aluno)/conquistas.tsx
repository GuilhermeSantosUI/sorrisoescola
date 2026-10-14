import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Lock, Star, Trophy, Flame, Smiley } from 'phosphor-react-native';
import type { ComponentType } from 'react';
import { progressoVazio, sequenciaDeDias, type ProgressoState } from '@sorriso/shared';
import type { IconProps } from 'phosphor-react-native';
import { borda, theme } from '../../constants/theme';
import { Card, Ilustracao, Tela, Texto, Titulo } from '../../components/ui';
import { lerProgresso } from '../../store/progress';

function Medalha({ Icone, nome, ganha }: { Icone: ComponentType<IconProps>; nome: string; ganha: boolean }) {
  return (
    <View style={{ width: '30%', alignItems: 'center', gap: theme.espaco(1), opacity: ganha ? 1 : 0.5 }}>
      <View style={{ width: theme.espaco(20), height: theme.espaco(20), borderRadius: theme.radii.full, borderWidth: borda + 2, borderColor: theme.colors.petroleo, backgroundColor: ganha ? theme.colors.amareloLimao : theme.colors.branco, alignItems: 'center', justifyContent: 'center' }}>
        {ganha ? <Icone size={36} weight="fill" color={theme.semantic.texto} /> : <Lock size={30} weight="bold" color={theme.semantic.texto} />}
      </View>
      <Texto pequeno negrito style={{ textAlign: 'center' }}>{nome}</Texto>
    </View>
  );
}

export default function Conquistas() {
  const [p, setP] = useState<ProgressoState>(progressoVazio());
  useEffect(() => { void lerProgresso().then(setP); }, []);
  const dias = sequenciaDeDias(p.diasEscovando, new Date());
  return (
    <Tela titulo="Conquistas">
      <Card style={{ alignItems: 'center' }}><Ilustracao nome="dente-brilhando" tamanho={96} /><Titulo tamanho="lg" style={{ textAlign: 'center' }}>{p.modulosConcluidos.length} módulos e {p.diasEscovando.length} dias escovando</Titulo></Card>
      <Card>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.espaco(4), justifyContent: 'center' }}>
          <Medalha Icone={Star} nome="Primeiro módulo" ganha={p.modulosConcluidos.length >= 1} />
          <Medalha Icone={Trophy} nome="Todos os módulos" ganha={p.modulosConcluidos.length >= 4} />
          <Medalha Icone={Smiley} nome="Primeira escovação" ganha={p.diasEscovando.length >= 1} />
          <Medalha Icone={Flame} nome="3 dias seguidos" ganha={dias >= 3} />
          <Medalha Icone={Flame} nome="7 dias seguidos" ganha={dias >= 7} />
        </View>
      </Card>
    </Tela>
  );
}
