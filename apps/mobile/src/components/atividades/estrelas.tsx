import { View } from 'react-native';
import { Star } from 'phosphor-react-native';
import { theme } from '../../constants/theme';

export function Estrelas({ ganhas, total = 3 }: { ganhas: number; total?: number }) {
  return (
    <View accessibilityRole="image" accessibilityLabel={`${ganhas} de ${total} estrelas`} style={{ flexDirection: 'row', gap: theme.espaco(2), justifyContent: 'center' }}>
      {Array.from({ length: total }, (_, i) => <Star key={i} size={56} weight={i < ganhas ? 'fill' : 'bold'} color={i < ganhas ? theme.colors.amareloLimao : theme.colors.petroleo} style={{ opacity: i < ganhas ? 1 : 0.3 }} />)}
    </View>
  );
}
