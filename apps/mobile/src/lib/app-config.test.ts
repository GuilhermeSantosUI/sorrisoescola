import { describe, expect, it } from 'vitest';
import { colors } from '@sorriso/shared';
import config from '../../app.config';

describe('app.config', () => {
  it('cores espelham tokens.ts', () => {
    expect(config.android?.adaptiveIcon?.backgroundColor).toBe(colors.turquesa);
    const splash = (config.plugins ?? []).find((p) => Array.isArray(p) && p[0] === 'expo-splash-screen') as [string, { backgroundColor: string }];
    expect(splash[1].backgroundColor).toBe(colors.neve);
  });
});
