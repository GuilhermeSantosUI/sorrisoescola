import { View, type ViewProps } from 'react-native';
import { borda, sombra, theme } from '../../constants/theme';

/** Espelha components/ui/card.tsx: borda 2, raio lg, padding 24, gap 12, sombra suave. */
export function Card({ style, ...p }: ViewProps) {
  return (
    <View
      style={[{ backgroundColor: theme.colors.branco, borderColor: theme.colors.petroleo, borderWidth: borda, borderRadius: theme.radii.lg, padding: theme.espaco(6), gap: theme.espaco(3) }, sombra.suave, style]}
      {...p}
    />
  );
}
