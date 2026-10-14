import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { borda, fontes, theme } from '../../constants/theme';
import { Icone } from '../ui/icon';
import type { ItemAba } from './abas';

export type { ItemAba };

type BarraProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

function Barra({ state, navigation, itens }: BarraProps & { itens: ItemAba[] }) {
  return (
    <View style={{ flexDirection: 'row', borderTopWidth: borda, borderTopColor: theme.colors.petroleo, backgroundColor: theme.colors.branco, paddingVertical: theme.espaco(2) }}>
      {state.routes.map((rota, i) => {
        const item = itens.find((x) => x.nome === rota.name);
        if (!item) return null;
        const ativo = state.index === i;
        return (
          <Pressable key={rota.key} accessibilityRole="tab" accessibilityState={{ selected: ativo }} onPress={() => navigation.navigate(rota.name)} style={{ flex: 1, alignItems: 'center', gap: theme.espaco(1), minHeight: theme.minTouch }}>
            <View style={{ width: theme.espaco(14), height: theme.espaco(7), borderRadius: theme.radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: ativo ? theme.colors.turquesa : 'transparent' }}><Icone nome={item.icone} size={22} /></View>
            <Text style={{ fontFamily: fontes.textoNegrito, fontSize: 12, color: theme.semantic.texto }}>{item.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Abas({ itens }: { itens: ItemAba[] }) {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <Barra {...p} itens={itens} />}>
      {itens.map((i) => <Tabs.Screen key={i.nome} name={i.nome} />)}
    </Tabs>
  );
}
