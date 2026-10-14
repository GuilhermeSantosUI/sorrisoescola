import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FAQ_ITENS } from '@sorriso/shared';
import { borda, fontes, theme } from '../constants/theme';
import { Button, Card, Icone, Tela, Texto } from '../components/ui';

export default function Ajuda() {
  const router = useRouter();
  const [aberto, setAberto] = useState<string | null>(null);
  return (
    <Tela voltar titulo="Ajuda">
      {FAQ_ITENS.map(([p, r]) => (
        <Pressable key={p} accessibilityRole="button" accessibilityState={{ expanded: aberto === p }} onPress={() => setAberto(aberto === p ? null : p)}
          style={{ borderWidth: borda, borderColor: theme.colors.petroleo, borderRadius: theme.radii.lg, backgroundColor: theme.colors.branco, paddingHorizontal: theme.espaco(4), paddingVertical: theme.espaco(3), gap: theme.espaco(2) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.espaco(2), minHeight: theme.minTouch }}>
            <Texto negrito style={{ flex: 1, fontFamily: fontes.textoNegrito }}>{p}</Texto><Icone nome={aberto === p ? 'erro' : 'mais'} size={22} />
          </View>
          {aberto === p && <Texto>{r}</Texto>}
        </Pressable>
      ))}
      <Card>
        <Button variante="outline" icone="ajuda" onPress={() => router.push('/legal')}>Termos e privacidade</Button>
        <Button variante="outline" icone="marca" onPress={() => router.push('/marca')}>Livro de marca</Button>
      </Card>
    </Tela>
  );
}
