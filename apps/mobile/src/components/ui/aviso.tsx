import { View } from 'react-native';
import { borda, theme } from '../../constants/theme';
import { Texto } from './text';

/** Mensagem de erro/aviso (web: toast). Borda e texto em `erro`, contraste AA sobre branco. */
export const Aviso = ({ texto }: { texto: string }) => (
  <View accessibilityRole="alert" style={{ borderWidth: borda, borderColor: theme.colors.erro, borderRadius: theme.radii.md, backgroundColor: theme.colors.branco, padding: theme.espaco(4) }}>
    <Texto negrito style={{ color: theme.colors.erro }}>{texto}</Texto>
  </View>
);
