import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { colors, expressoes, palette, paresContraste, poses } from '@sorriso/shared';

const valores = new Set<string>(Object.values(colors));

describe('livro de marca', () => {
  it('todas as cores exibidas existem em tokens.ts', () => {
    for (const p of palette) expect(valores.has(p.hex)).toBe(true);
    for (const [fg, bg] of paresContraste) {
      expect(valores.has(colors[fg])).toBe(true);
      expect(valores.has(colors[bg])).toBe(true);
    }
  });

  it('nenhum componente de marca usa cor literal', () => {
    const arquivos = ['components/brand-sections.tsx', 'pages/branding.tsx', ...readdirSync(join(import.meta.dirname, 'components/ui')).map((f) => `components/ui/${f}`)];
    for (const f of arquivos) {
      const src = readFileSync(join(import.meta.dirname, f), 'utf8');
      expect(src, f).not.toMatch(/#[0-9a-fA-F]{6}\b/);
      expect(src, f).not.toMatch(/\brgb\(|\bhsl\(/);
    }
  });

  it('toda pose e expressão listada tem SVG e PNG em assets/mascot', () => {
    const dir = join(import.meta.dirname, '../../../assets/mascot');
    for (const { arquivo } of [...poses, ...expressoes]) {
      expect(existsSync(join(dir, `${arquivo}.svg`)), `${arquivo}.svg`).toBe(true);
      expect(existsSync(join(dir, `${arquivo}.png`)), `${arquivo}.png`).toBe(true);
    }
  });
});
