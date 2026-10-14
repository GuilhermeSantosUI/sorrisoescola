import { TextInput, View, type TextInputProps } from 'react-native';
import { borda, fontes, theme } from '../../constants/theme';
import { Rotulo } from './text';

/** Espelha Input + Label do web: altura 48, borda 2, raio md, padding 16. */
export function Campo({ rotulo, testID, ...p }: TextInputProps & { rotulo: string }) {
  return (
    <View style={{ gap: theme.espaco(2) }}>
      <Rotulo>{rotulo}</Rotulo>
      <TextInput
        testID={testID}
        accessibilityLabel={rotulo}
        placeholderTextColor={theme.colors.petroleo}
        style={{ height: theme.minTouch, borderRadius: theme.radii.md, borderWidth: borda, borderColor: theme.colors.petroleo, backgroundColor: theme.colors.branco, paddingHorizontal: theme.espaco(4), fontFamily: fontes.texto, fontSize: theme.fontSizes.base, color: theme.semantic.texto }}
        {...p}
      />
    </View>
  );
}
