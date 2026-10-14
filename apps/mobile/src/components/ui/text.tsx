import { Text, type TextProps } from 'react-native';
import { fontes, theme } from '../../constants/theme';

type Tamanho = '3xl' | '2xl' | 'xl' | 'lg';

/** Títulos em Baloo 2 (web: h1..h3). */
export function Titulo({ tamanho = 'xl', style, ...p }: TextProps & { tamanho?: Tamanho }) {
  const fontSize = theme.fontSizes[tamanho];
  return <Text accessibilityRole="header" style={[{ fontFamily: fontes.titulo, fontSize, lineHeight: Math.round(fontSize * 1.15), color: theme.semantic.texto }, style]} {...p} />;
}

/** Texto corrido em Nunito 18 px (web: text-base). */
export function Texto({ pequeno, negrito, style, ...p }: TextProps & { pequeno?: boolean; negrito?: boolean }) {
  const fontSize = pequeno ? theme.fontSizes.sm : theme.fontSizes.base;
  return <Text style={[{ fontFamily: negrito ? fontes.textoNegrito : fontes.texto, fontSize, lineHeight: Math.round(fontSize * 1.5), color: theme.semantic.texto }, style]} {...p} />;
}

/** Rótulo de campo (web: Label, font-bold). */
export const Rotulo = (p: TextProps) => <Texto negrito {...p} />;
