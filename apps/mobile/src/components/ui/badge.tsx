import { Text, View } from 'react-native';
import { fontes, theme } from '../../constants/theme';

/** Espelha components/ui/badge.tsx (variantes default, secondary e outline). */
export function Badge({ children, variante = 'default', testID }: { children: string; variante?: 'default' | 'secondary' | 'outline'; testID?: string }) {
  const fundo = variante === 'default' ? theme.colors.turquesa : variante === 'secondary' ? theme.colors.limao : 'transparent';
  return (
    <View testID={testID} style={{ alignSelf: 'flex-start', borderRadius: theme.radii.full, backgroundColor: fundo, borderWidth: 1, borderColor: variante === 'outline' ? theme.colors.petroleo : 'transparent', paddingHorizontal: theme.espaco(3), paddingVertical: theme.espaco(1) }}>
      <Text style={{ fontFamily: fontes.textoNegrito, fontSize: theme.fontSizes.sm, color: theme.semantic.texto }}>{children}</Text>
    </View>
  );
}
