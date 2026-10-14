/**
 * FONTE ÚNICA dos tokens de design. Web (@theme) e mobile (theme.ts) derivam daqui.
 * Valores de cor extraídos do ícone (ver AGENTS.md). Tema claro apenas.
 */
export const colors = {
  turquesa: '#53D9C5',
  verdeAgua: '#4DAEA2',
  petroleo: '#3B5C63',
  // TODO: tom de apoio criado para contraste AA com fundos turquesa/limão, o time precisa aprovar.
  petroleoEscuro: '#2B484F',
  limao: '#B6F15A',
  amareloLimao: '#DBE622',
  branco: '#FFFFFF',
  // TODO: tom de apoio (fundo suave), o time precisa aprovar.
  neve: '#F4FBF9',
  // TODO: feedback de erro com contraste AA sobre branco, o time precisa aprovar.
  erro: '#B3261E',
  // TODO: tom de apoio para sujeira/cárie nas ilustrações, o time precisa aprovar.
  sujeira: '#9A8A3A',
} as const;
export type ColorName = keyof typeof colors;

export interface PaletteEntry {
  name: ColorName;
  label: string;
  hex: string;
  uso: string;
  apoio?: boolean;
}

/** Paleta exibida no livro de marca. `apoio` = tom criado depois do ícone (precisa de aprovação). */
export const palette: PaletteEntry[] = [
  { name: 'turquesa', label: 'Turquesa', hex: colors.turquesa, uso: 'Primária, o mascote' },
  { name: 'verdeAgua', label: 'Verde-água escuro', hex: colors.verdeAgua, uso: 'Secundária, sombras' },
  { name: 'petroleo', label: 'Petróleo', hex: colors.petroleo, uso: 'Contornos e texto grande' },
  { name: 'limao', label: 'Verde-limão', hex: colors.limao, uso: 'Fundo e destaque' },
  { name: 'amareloLimao', label: 'Amarelo-limão', hex: colors.amareloLimao, uso: 'Fundo e destaque' },
  { name: 'branco', label: 'Branco', hex: colors.branco, uso: 'Dentes e respiros' },
  { name: 'petroleoEscuro', label: 'Petróleo escuro', hex: colors.petroleoEscuro, uso: 'Texto corrido (AA em todos os fundos)', apoio: true },
  { name: 'neve', label: 'Neve', hex: colors.neve, uso: 'Fundo de telas', apoio: true },
  { name: 'erro', label: 'Erro', hex: colors.erro, uso: 'Mensagens de erro', apoio: true },
  { name: 'sujeira', label: 'Sujeira', hex: colors.sujeira, uso: 'Manchas e cárie nas ilustrações', apoio: true },
];

/** Cores semânticas usadas pelos apps. */
export const semantic = {
  fundo: colors.neve,
  superficie: colors.branco,
  texto: colors.petroleoEscuro,
  primaria: colors.turquesa,
  destaque: colors.limao,
  contorno: colors.petroleo,
  erro: colors.erro,
} as const;

export const fonts = {
  titulo: 'Baloo 2',
  texto: 'Nunito',
} as const;

export const fontWeights = { regular: 400, semibold: 600, bold: 700, extrabold: 800 } as const;

/** Escala tipográfica em px. Base grande (acessibilidade). */
export const fontSizes = {
  base: 18,
  sm: 16,
  lg: 22,
  xl: 28,
  '2xl': 36,
  '3xl': 48,
  sala: 64,
} as const;

/** Escala de espaçamento: n × 4 px (igual ao Tailwind com raiz de 16 px). */
export const espaco = (n: number): number => n * 4;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 } as const;
export const radii = { sm: 8, md: 16, lg: 24, full: 9999 } as const;
export const shadows = {
  suave: '0 4px 12px rgba(43, 72, 79, 0.15)',
  forte: '0 8px 24px rgba(43, 72, 79, 0.25)',
} as const;

/** Alvo de toque mínimo em px. Botões, campos e linhas tocáveis usam esta altura (h-12 no web). */
export const minTouch = 48;
export const minLogoSize = { digitalPx: 24, impressaoMm: 15 } as const;
