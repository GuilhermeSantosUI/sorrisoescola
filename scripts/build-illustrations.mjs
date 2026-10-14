// Extrai e adapta as ilustrações (dentinhos, brilho, bolhas) do vetor do mascote.
// Uso: pnpm illustrations:build
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { colors } from '../packages/shared/src/tokens.ts';

const ROOT = new URL('../assets/', import.meta.url).pathname;
const OUT = `${ROOT}illustrations/`;
mkdirSync(OUT, { recursive: true });
const raw = readFileSync(`${ROOT}_source/brand/mascote-vetorizado.svg`, 'utf8');
const paths = [...raw.matchAll(/<path d="([^"]+)" fill="([^"]+)"\/>/g)].map((m) => ({ d: m[1], fill: m[2] }));
const pick = (...pre) => pre.map((x) => {
  const p = paths.find((q) => q.d.startsWith(x));
  if (!p) throw new Error(`Prefixo não encontrado: ${x}`);
  return p;
});

// bbox aproximada (inclui pontos de controle); o vetor só usa comandos absolutos
function bbox(list) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const { d } of list) {
    let cmd = '', nums = [];
    const flush = () => {
      if (cmd === 'H') nums.forEach((n) => { x0 = Math.min(x0, n); x1 = Math.max(x1, n); });
      else if (cmd === 'V') nums.forEach((n) => { y0 = Math.min(y0, n); y1 = Math.max(y1, n); });
      else for (let i = 0; i + 1 < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
    };
    for (const t of d.match(/[MLHVCZ]|-?\d*\.?\d+/g)) {
      if (/[MLHVCZ]/.test(t)) { flush(); cmd = t; nums = []; } else nums.push(parseFloat(t));
    }
    flush();
  }
  return { x0, y0, x1, y1 };
}
const el = (p, contorno = false) => `<path d="${p.d}" fill="${p.fill}"${contorno ? ` stroke="${colors.petroleo}" stroke-width="5" stroke-linejoin="round"` : ''}/>`;
function svg(list, extra = '', pad = 10, override, contorno = true) {
  const b = override ?? bbox(list);
  const side = Math.max(b.x1 - b.x0, b.y1 - b.y0) + pad * 2;
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  const vb = `${(cx - side / 2).toFixed(1)} ${(cy - side / 2).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="512" height="512" fill="none">${list.map((p, i) => el(p, contorno && i === 0 && p.fill !== colors.turquesa && !p.d.startsWith('M776.91') && !p.d.startsWith('M895') && !p.d.startsWith('M863'))).join('')}${extra}</svg>\n`;
}

const out = {};
// Dentinhos originais
const dentes = {
  'dente-feliz': pick('M909.945 294.146', 'M920.035 329.646', 'M910.045 316.202', 'M944.315 326.835'),
  'dente-bochechas': pick('M923.235 663.11', 'M912.33 695.99', 'M955.115 713.58', 'M956.895 701.2', 'M925.06 688.795', 'M932.78 703.6'),
  'dente-azul': pick('M776.91 76.734', 'M751.52 127.114', 'M836.31 104.922', 'M783.69 129.731', 'M810.88 126.257', 'M773.94 114.76'),
  'dente-classico': pick('M218.951 86.5735', 'M216.954 132.145', 'M192.57 131.319', 'M224.64 118.368'),
  'dente-lateral': pick('M96.8945 483.58', 'M91.4595 529.235', 'M100.968 510.285', 'M68.328 523.77'),
};
for (const [n, l] of Object.entries(dentes)) out[n] = svg(l);

// Adaptações a partir do dente feliz: triste, sujo, brilhando
const corpo = pick('M909.945 294.146')[0];
const olhos = pick('M910.045 316.202', 'M944.315 326.835');
const bb = bbox([corpo]);
const VB_BASE = svg([corpo]).match(/viewBox="([^"]+)"/)[1];
const rosto = (boca) => `${olhos.map((p) => el(p)).join('')}${boca}`;
const bocaTriste = `<path d="M917 345 Q926 335 936 341" stroke="${colors.petroleo}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`;
const lagrima = `<path d="M946 338 q4 6 0 9 q-4 -3 0 -9z" fill="${colors.turquesa}" stroke="${colors.petroleo}" stroke-width="1.6" stroke-linejoin="round"/>`;
out['dente-triste'] = svg([corpo], rosto(bocaTriste) + lagrima);
const manchas = [[905, 345, 7], [932, 308, 5], [948, 352, 6], [920, 372, 5], [900, 322, 4]]
  .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${colors.sujeira}" opacity="0.85"/>`).join('');
out['dente-sujo'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB_BASE}" width="512" height="512" fill="none"><defs><clipPath id="c"><path d="${corpo.d}"/></clipPath></defs>${el(corpo, true)}<g clip-path="url(#c)">${manchas}</g>${rosto(bocaTriste)}</svg>\n`;

// Brilho (estrela de 4 pontas da boca do mascote) recolorido para fundos claros
const estrela = pick('M648.965 443.472')[0];
const brilho = (cx, cy, s) => `<path transform="translate(${cx} ${cy}) scale(${s}) translate(-650 -490)" d="${estrela.d}" fill="${colors.amareloLimao}" stroke="${colors.petroleo}" stroke-width="${6 / s}" stroke-linejoin="round"/>`;
const bbBrilhando = { x0: bb.x0 - 6, y0: bb.y0 - 24, x1: bb.x1 + 26, y1: bb.y1 };
out['dente-brilhando'] = svg([corpo], rosto(pick('M920.035 329.646').map((p) => el(p)).join('')) + brilho(bb.x1 + 4, bb.y0 + 2, 0.42) + brilho(bb.x0 - 2, bb.y1 - 10, 0.26), 10, bbBrilhando);
out['brilho'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="560 400 180 180" width="512" height="512" fill="none">${brilho(650, 490, 1.2)}</svg>\n`;

// Bolhas
out['bolha-1'] = svg(pick('M895.02 433.485', 'M869.125 428.22', 'M866.13 432.615'));
out['bolha-2'] = svg(pick('M863.145 497.243', 'M862.235 506.71', 'M860.115 512.7'));

for (const [n, c] of Object.entries(out)) {
  writeFileSync(`${OUT}${n}.svg`, c);
  await sharp(Buffer.from(c), { density: 144 }).resize(512, 512).png().toFile(`${OUT}${n}.png`);
}
// PNGs para o app mobile (Metro precisa dos assets dentro do projeto)
const MOBILE = new URL('../apps/mobile/assets/ilustracoes/', import.meta.url).pathname;
mkdirSync(MOBILE, { recursive: true });
for (const n of Object.keys(out)) copyFileSync(`${OUT}${n}.png`, `${MOBILE}${n}.png`);

try {
  execFileSync('rm', ['-f', `${OUT}sorriso-ilustracoes.zip`]);
  execFileSync('zip', ['-q', `${OUT}sorriso-ilustracoes.zip`, ...Object.keys(out).flatMap((n) => [`${n}.svg`, `${n}.png`])], { cwd: OUT });
} catch { console.warn('zip indisponível'); }
console.log(`${Object.keys(out).length} ilustrações em assets/illustrations/`);
