// Confere se os arquivos da marca listados em brand.ts existem em assets/brand.
import { existsSync } from 'node:fs';
import { variacoesLogo } from '../packages/shared/src/data/brand';

const missing = variacoesLogo.flatMap((v) =>
  ['svg', 'png'].map((e) => `assets/brand/${v.arquivo}.${e}`).filter((p) => !existsSync(new URL(`../${p}`, import.meta.url))),
);
if (missing.length) {
  console.error('Arquivos de marca ausentes (placeholders):\n' + missing.join('\n'));
  process.exit(1);
}
console.log('Arquivos de marca completos.');
