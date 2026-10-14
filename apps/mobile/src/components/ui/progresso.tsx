import { View } from 'react-native';
import { borda, theme } from '../../constants/theme';

/** Espelha ProgressBar do web: altura 16, borda 2, preenchimento turquesa. */
export function Progresso({ valor, rotulo, testID }: { valor: number; rotulo: string; testID?: string }) {
  const v = Math.max(0, Math.min(100, valor));
  return (
    <View testID={testID} accessibilityRole="progressbar" accessibilityLabel={rotulo} accessibilityValue={{ min: 0, max: 100, now: v }}
      style={{ alignSelf: 'stretch', height: theme.espaco(4), borderRadius: theme.radii.full, borderWidth: borda, borderColor: theme.colors.petroleo, backgroundColor: theme.colors.branco, overflow: 'hidden' }}>
      <View style={{ width: `${v}%`, height: '100%', backgroundColor: theme.colors.turquesa }} />
    </View>
  );
}
