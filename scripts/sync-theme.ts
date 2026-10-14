// Gera/confere o bloco @theme de apps/web/src/index.css a partir de tokens.ts.
// Uso: tsx scripts/sync-theme.ts [--check]
import { readFileSync, writeFileSync } from 'node:fs';
import { renderTheme } from '../packages/shared/src/theme-css';

const file = new URL('../apps/web/src/index.css', import.meta.url);
const START = '/* tokens:start (gerado por `pnpm theme:sync`; não edite) */';
const END = '/* tokens:end */';
const css = readFileSync(file, 'utf8');
const re = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
if (!re.test(css)) throw new Error('Marcadores tokens:start/tokens:end não encontrados em index.css');
const next = css.replace(re, `${START}\n${renderTheme()}\n${END}`);

if (process.argv.includes('--check')) {
  if (next !== css) {
    console.error('index.css divergente de tokens.ts. Rode `pnpm theme:sync`.');
    process.exit(1);
  }
  console.log('Tema em sincronia com tokens.ts.');
} else {
  writeFileSync(file, next);
  console.log('index.css atualizado.');
}
