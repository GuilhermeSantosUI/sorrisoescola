// Derivado de packages/shared/src/tokens.ts: não declare cores nem medidas aqui.
import { colors, espaco, fontSizes, minTouch, radii, semantic } from '@sorriso/shared';

/** Famílias carregadas por expo-font (app/_layout.tsx). Pesos entram pelo nome da fonte no RN. */
export const fontes = {
  titulo: 'Baloo2_800ExtraBold',
  tituloMedio: 'Baloo2_700Bold',
  texto: 'Nunito_400Regular',
  textoSemi: 'Nunito_600SemiBold',
  textoNegrito: 'Nunito_700Bold',
} as const;

/** Sombra "suave" do design system (web: shadow-suave). */
export const sombra = {
  suave: { shadowColor: colors.petroleoEscuro, shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  forte: { shadowColor: colors.petroleoEscuro, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
} as const;

/** Largura padrão de borda dos componentes (web: border-2). */
export const borda = 2;

export const theme = { colors, semantic, fontSizes, radii, minTouch, espaco, fontes, sombra, borda } as const;
