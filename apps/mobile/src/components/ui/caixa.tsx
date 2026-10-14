import { Pressable, View } from 'react-native';
import { borda, theme } from '../../constants/theme';
import { Icone } from './icon';
import { Texto } from './text';

/** Caixa de seleção (web: Checkbox size-7, borda 2, raio md). */
export function Caixa({ marcado, onChange, rotulo, desabilitado }: { marcado: boolean; onChange?: (v: boolean) => void; rotulo: string; desabilitado?: boolean }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: marcado, disabled: desabilitado }} disabled={desabilitado} onPress={() => onChange?.(!marcado)}
      style={{ minHeight: theme.minTouch, flexDirection: 'row', alignItems: 'center', gap: theme.espaco(3), opacity: desabilitado ? 0.7 : 1 }}>
      <View style={{ width: theme.espaco(7), height: theme.espaco(7), borderRadius: theme.radii.md / 2, borderWidth: borda, borderColor: theme.colors.petroleo, backgroundColor: marcado ? theme.colors.turquesa : theme.colors.branco, alignItems: 'center', justifyContent: 'center' }}>
        {marcado && <Icone nome="ok" size={20} />}
      </View>
      <View style={{ flex: 1 }}><Texto>{rotulo}</Texto></View>
    </Pressable>
  );
}
