import { Pressable, Text, View } from 'react-native';
import { borda, fontes, sombra, theme } from '../../constants/theme';
import { ICONES, Icone, type IconeNome } from './icon';

export type VarianteBotao = 'default' | 'outline' | 'secondary' | 'ghost';

interface Props {
  children: string;
  onPress?: () => void;
  /** nome do ícone Phosphor (ver ICONES) ou caractere curto (ex.: número da opção) */
  icone?: IconeNome | (string & {});
  variante?: VarianteBotao;
  tamanho?: 'default' | 'lg';
  disabled?: boolean;
  testID?: string;
}

const fundo: Record<VarianteBotao, string> = {
  default: theme.colors.turquesa, outline: theme.colors.branco, secondary: theme.colors.limao, ghost: 'transparent',
};

/** Espelha components/ui/button.tsx do web: pílula, alvo mínimo de 48 px, ícone + texto. */
export function Button({ children, onPress, icone, variante = 'default', tamanho = 'default', disabled, testID }: Props) {
  const lg = tamanho === 'lg';
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: lg ? theme.espaco(20) : theme.minTouch,
          paddingHorizontal: lg ? theme.espaco(8) : theme.espaco(5),
          borderRadius: theme.radii.full,
          backgroundColor: fundo[variante],
          borderWidth: variante === 'outline' ? borda : 0,
          borderColor: theme.colors.petroleo,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.espaco(2),
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        variante !== 'ghost' && sombra.suave,
      ]}
    >
      {icone ? (
        icone in ICONES ? <Icone nome={icone as IconeNome} size={lg ? 32 : 24} /> : (
          <View style={{ width: theme.espaco(9), height: theme.espaco(9), borderRadius: theme.radii.full, backgroundColor: theme.colors.turquesa, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fontes.textoNegrito, fontSize: theme.fontSizes.base, color: theme.semantic.texto }}>{icone}</Text>
          </View>
        )
      ) : null}
      <Text style={{ fontFamily: fontes.textoNegrito, fontSize: lg ? theme.fontSizes.xl : theme.fontSizes.base, color: theme.semantic.texto }}>{children}</Text>
    </Pressable>
  );
}
