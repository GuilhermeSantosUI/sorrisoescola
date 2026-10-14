import { colors, fonts, fontSizes, radii, shadows, minTouch } from './tokens';

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Bloco do @theme do Tailwind, gerado a partir de tokens.ts. */
export function renderTheme(): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(colors)) lines.push(`  --color-${kebab(k)}: ${v};`);
  // Variáveis semânticas do shadcn/ui, derivadas dos tokens.
  const sem: Record<string, string> = {
    background: colors.neve, foreground: colors.petroleoEscuro,
    card: colors.branco, 'card-foreground': colors.petroleoEscuro,
    popover: colors.branco, 'popover-foreground': colors.petroleoEscuro,
    primary: colors.turquesa, 'primary-foreground': colors.petroleoEscuro,
    secondary: colors.limao, 'secondary-foreground': colors.petroleoEscuro,
    muted: colors.neve, 'muted-foreground': colors.petroleo,
    accent: colors.limao, 'accent-foreground': colors.petroleoEscuro,
    destructive: colors.erro, 'destructive-foreground': colors.branco,
    border: colors.petroleo, input: colors.petroleo, ring: colors.petroleoEscuro,
  };
  for (const [k, v] of Object.entries(sem)) lines.push(`  --color-${k}: ${v};`);
  lines.push(`  --font-titulo: '${fonts.titulo}', system-ui, sans-serif;`);
  lines.push(`  --font-texto: '${fonts.texto}', system-ui, sans-serif;`);
  for (const [k, v] of Object.entries(fontSizes)) lines.push(`  --text-${k}: ${v / 16}rem;`);
  for (const [k, v] of Object.entries(radii)) lines.push(`  --radius-${k}: ${v}px;`);
  lines.push(`  --shadow-suave: ${shadows.suave};`);
  lines.push(`  --shadow-forte: ${shadows.forte};`);
  lines.push(`  --spacing-touch: ${minTouch}px;`);
  return `@theme {\n${lines.join('\n')}\n}`;
}
