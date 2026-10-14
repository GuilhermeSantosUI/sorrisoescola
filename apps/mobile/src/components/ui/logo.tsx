/* eslint-disable @typescript-eslint/no-require-imports -- Metro exige require() para assets */
import { Image } from 'react-native';

const FONTES = {
  completa: require('../../../assets/brand/logo-completa.png'),
  icone: require('../../../assets/brand/logo-icone.png'),
  'sem-fundo': require('../../../assets/brand/logo-sem-fundo.png'),
} as const;

export function Logo({ variante = 'completa', size = 96, rotulo }: { variante?: keyof typeof FONTES; size?: number; rotulo?: string }) {
  return <Image source={FONTES[variante]} style={{ width: size, height: size }} accessibilityLabel={rotulo} accessible={Boolean(rotulo)} />;
}
