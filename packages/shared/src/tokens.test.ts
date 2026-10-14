import { describe, expect, it } from 'vitest';
import { palette, colors } from './tokens';
import { contrastRatio, AA_NORMAL } from './color';
import { paresContraste } from './data/brand';

describe('tokens', () => {
  it('paleta só referencia cores existentes', () => {
    for (const p of palette) expect(colors[p.name]).toBe(p.hex);
  });
  it('pares de contraste usam cores existentes', () => {
    for (const [a, b] of paresContraste) {
      expect(colors).toHaveProperty(a);
      expect(colors).toHaveProperty(b);
    }
  });
  it('texto corrido (petróleo escuro) passa AA em todos os fundos de marca', () => {
    for (const bg of ['branco', 'turquesa', 'limao', 'amareloLimao', 'neve'] as const)
      expect(contrastRatio(colors.petroleoEscuro, colors[bg])).toBeGreaterThanOrEqual(AA_NORMAL);
  });
  it('branco sobre turquesa/limão/amarelo NÃO passa AA', () => {
    for (const bg of ['turquesa', 'limao', 'amareloLimao'] as const)
      expect(contrastRatio(colors.branco, colors[bg])).toBeLessThan(AA_NORMAL);
  });
});
