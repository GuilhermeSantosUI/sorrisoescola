import { useState } from 'react';
import { View } from 'react-native';
import type { Passo } from '@sorriso/shared';
import { theme } from '../../constants/theme';
import { Button, Card, Mascote, Texto, Titulo } from '../ui';

/** Passo a passo: uma ação por tela, com o mascote na pose do passo. */
export function Passos({ passos, onFim, grande }: { passos: Passo[]; onFim?: () => void; grande?: boolean }) {
  const [i, setI] = useState(0);
  const p = passos[i];
  if (!p) return null;
  const ultimo = i === passos.length - 1;
  return (
    <Card style={{ alignItems: 'center' }}>
      <Texto negrito>Passo {i + 1} de {passos.length}</Texto>
      <Mascote pose={p.pose ?? 'acenando'} altura={grande ? 240 : 190} decorativo />
      <View style={{ gap: theme.espaco(2), alignItems: 'center' }}>
        <Titulo tamanho={grande ? '2xl' : 'xl'} style={{ textAlign: 'center' }}>{p.titulo}</Titulo>
        <Texto style={{ textAlign: 'center', fontSize: grande ? theme.fontSizes.lg : theme.fontSizes.base }}>{p.texto}</Texto>
      </View>
      <View style={{ flexDirection: 'row', gap: theme.espaco(3) }}>
        {i > 0 && <Button variante="outline" icone="voltar" onPress={() => setI(i - 1)}>Voltar</Button>}
        <Button icone={ultimo ? 'ok' : 'proximo'} onPress={() => (ultimo ? onFim?.() : setI(i + 1))}>{ultimo ? 'Pronto' : 'Próximo'}</Button>
      </View>
    </Card>
  );
}
