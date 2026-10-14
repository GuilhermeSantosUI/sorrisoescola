// Gera as variações da marca em assets/brand a partir do vetor do mascote.
// Uso: pnpm brand:build   (fonte: assets/_source/brand/)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import opentype from 'opentype.js';
import { colors } from '../packages/shared/src/tokens.ts';

const OUT = new URL('../assets/brand/', import.meta.url).pathname;
const SRC = new URL('../assets/_source/brand/', import.meta.url).pathname;
const raw = readFileSync(`${SRC}mascote-vetorizado.svg`, 'utf8');
const paths = [...raw.matchAll(/<path d="([^"]+)" fill="([^"]+)"\/>/g)].map((m) => ({ d: m[1], fill: m[2] }));

const BG = paths.findIndex((p) => p.fill === '#81DE7A' && p.d.startsWith('M0 0H250.546H359.611H664.415'));
const BASE = paths.findIndex((p) => p.fill === '#1C636E' && p.d.startsWith('M0 0H250.546H359.611H664.415'));
if (BG < 0 || BASE < 0) throw new Error('Estrutura do SVG mudou: fundo não encontrado');

// Cantos brancos, frisos turquesa da borda e mancha limão do vetor original (o fundo é refeito).
const ARTEFATOS = [
  'M0 0H250.546H359.611L359.706', 'M0 0H250.546L249.845', 'M664.415 0H773.325H1024V245.042V360.648L1023.29',
  'M773.325 0H1024V245.042C', 'M0 792.905L0.141475', 'M1024 792.96V1024H793.33', 'M0 693.42C0.249',
  'M896.335 872.845C900.63', 'M609.295 127.858L609.745',
];
// Dentinhos, estrelas e pontinhos soltos pelo fundo.
const SOLTOS = [
  'M96.8945 483.58', 'M91.4595 529.235', 'M100.968 510.285', 'M68.328 523.77',
  'M218.951 86.5735', 'M216.954 132.145', 'M192.57 131.319', 'M224.64 118.368',
  'M776.91 76.734', 'M751.52 127.114', 'M836.31 104.922', 'M783.69 129.731', 'M810.88 126.257', 'M773.94 114.76',
  'M909.945 294.146', 'M920.035 329.646', 'M910.045 316.202', 'M944.315 326.835',
  'M923.235 663.11', 'M912.33 695.99', 'M955.115 713.58', 'M956.895 701.2', 'M925.06 688.795', 'M932.78 703.6',
  'M923.65 588.735', 'M242.496 47.2509', 'M116.65 441.749', 'M888.63 258.242',
  'M684.9 72.3705', 'M83.5835 628.92', 'M906.165 794.4', 'M706.705 125.306', 'M897.265 121.783', 'M79.9045 438.363',
  'M272.414 88.7305', 'M962.035 513.255', 'M957.645 263.248', 'M140.998 160.266', 'M961.835 625.25',
  'M725.395 60.3485', 'M40.5728 573.295', 'M975.845 373.702', 'M313.569 88.314',
];
const BOLHAS = ['M895.02 433.485', 'M869.125 428.22', 'M866.13 432.615', 'M863.145 497.243', 'M862.235 506.71', 'M860.115 512.7'];
const BRILHOS_BOCA = ['M648.965 443.472', 'M641.14 475.927', 'M320.73 573.46'];

const todos = [...ARTEFATOS, ...SOLTOS, ...BOLHAS, ...BRILHOS_BOCA];
for (const pre of todos) if (!paths.some((p) => p.d.startsWith(pre))) throw new Error(`Prefixo não encontrado: ${pre}`);
const casa = (lista) => (p) => lista.some((pre) => p.d.startsWith(pre));

// Superelipse (n=5) ≈ ícone de app arredondado.
const squircle = (() => {
  const pts = [];
  for (let i = 0; i < 720; i++) {
    const t = (i / 720) * Math.PI * 2;
    const c = Math.cos(t), s = Math.sin(t);
    const f = (v) => Math.sign(v) * Math.abs(v) ** (2 / 7);
    pts.push(`${(512 + 512 * f(c)).toFixed(1)} ${(512 + 512 * f(s)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
})();

const GRAD = `<radialGradient id="fundo" cx="0.62" cy="0.4" r="0.78"><stop offset="0" stop-color="${colors.amareloLimao}"/><stop offset="0.42" stop-color="${colors.limao}"/><stop offset="1" stop-color="${colors.turquesa}"/></radialGradient>`;
const el = (p, extra = '') => `<path d="${p.d}" fill="${p.fill}"${extra}/>`;

function mascote({ fundo, soltos, brilhos, bolhas }) {
  let rem = [...ARTEFATOS];
  if (!soltos) rem = rem.concat(SOLTOS);
  if (!brilhos) rem = rem.concat(BRILHOS_BOCA);
  if (!bolhas) rem = rem.concat(BOLHAS);
  const drop = casa(rem);
  const corpo = paths.map((p, i) => {
    if (i === BG) return null; // tratado à parte
    if (drop(p)) return null;
    if (i === BASE) return fundo ? el(p) : el(p, ' mask="url(#recorte)"');
    return el(p);
  });
  const bgEl = fundo ? `<path d="${paths[BG].d}" fill="url(#fundo)"/>` : '';
  const defs = `<defs>${GRAD}<clipPath id="forma"><path d="${squircle}"/></clipPath>` +
    (fundo ? '' : `<mask id="recorte"><rect width="1024" height="1024" fill="#fff"/><path d="${paths[BG].d}" fill="#000"/></mask>`) + '</defs>';
  // base (#1C636E) vem antes do fundo na ordem original
  const out = [];
  paths.forEach((p, i) => {
    if (i === BG) out.push(bgEl);
    else if (corpo[i]) out.push(corpo[i]);
  });
  return { defs, body: out.join('') };
}

const svg = (inner, w = 1024, h = 1024, vb = '0 0 1024 1024') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" fill="none">${inner}</svg>\n`;

const completa = (() => { const m = mascote({ fundo: true, soltos: true, brilhos: true, bolhas: true }); return svg(`${m.defs}<g clip-path="url(#forma)">${m.body}</g>`); })();
const icone = (() => { const m = mascote({ fundo: true, soltos: false, brilhos: false, bolhas: false }); return svg(`${m.defs}<g clip-path="url(#forma)">${m.body}</g>`); })();
const semFundoInner = (() => { const m = mascote({ fundo: false, soltos: false, brilhos: true, bolhas: true }); return `${m.defs}<g clip-path="url(#forma)">${m.body}</g>`; })();
const semFundo = svg(semFundoInner);

// Monocromática (impressão): contornos e sombras viram uma cor; claros ficam vazados.
const mono = svg(
  `<defs><filter id="mono" color-interpolation-filters="sRGB" x="0" y="0" width="1" height="1">
<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -8.504 -28.608 -2.888 0 22" result="a"/>
<feComposite in="a" in2="SourceAlpha" operator="in" result="b"/>
<feFlood flood-color="${colors.petroleoEscuro}"/><feComposite in2="b" operator="in"/></filter></defs>
<g filter="url(#mono)">${semFundoInner}</g>`,
);

// Logotipo: ícone + texto convertido em curvas (sem depender de fonte instalada).
const fb = readFileSync(`${SRC}Baloo2-800.ttf`);
const font = opentype.parse(fb.buffer.slice(fb.byteOffset, fb.byteOffset + fb.byteLength));
const txt = (t, x, y, size, fill) => `<path d="${font.getPath(t, x, y, size).toPathData(2)}" fill="${fill}"/>`;
const largura = (t, size) => font.getAdvanceWidth(t, size);
const logotipo = (() => {
  const m = mascote({ fundo: true, soltos: true, brilhos: true, bolhas: true });
  const x = 1024 + 96;
  const w = Math.ceil(x + Math.max(largura('Sorriso', 440), largura('na Escola', 440)) + 40);
  return svg(
    `${m.defs}<g clip-path="url(#forma)">${m.body}</g>${txt('Sorriso', x, 520, 440, colors.petroleoEscuro)}${txt('na Escola', x, 900, 440, colors.petroleo)}`,
    w, 1024, `0 0 ${w} 1024`,
  );
})();

const arquivos = { 'logo-completa': completa, 'logo-icone': icone, 'logo-sem-fundo': semFundo, 'logo-mono': mono, logotipo };
mkdirSync(OUT, { recursive: true });
for (const [nome, conteudo] of Object.entries(arquivos)) {
  writeFileSync(`${OUT}${nome}.svg`, conteudo);
  await sharp(Buffer.from(conteudo), { density: 144 }).resize({ height: 1024 }).png().toFile(`${OUT}${nome}.png`);
}

// Ícones de app/PWA/favicon a partir da versão reduzida.
const iconeBuf = Buffer.from(icone);
for (const s of [16, 32, 48, 180, 192, 512]) {
  await sharp(iconeBuf, { density: 144 }).resize(s, s).png().toFile(`${OUT}icon-${s}.png`);
}
const miolo = await sharp(iconeBuf, { density: 144 }).resize(Math.round(512 * 0.82)).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: colors.turquesa } })
  .composite([{ input: miolo, gravity: 'center' }]).png().toFile(`${OUT}icon-maskable-512.png`);

// Pacote completo.
try {
  execFileSync('rm', ['-f', `${OUT}sorriso-marca.zip`]);
  execFileSync('zip', ['-qr', `${OUT}sorriso-marca.zip`, '.', '-x', '*.zip', '-x', 'README.md'], { cwd: OUT });
} catch { console.warn('zip indisponível: pacote não gerado'); }
console.log('Marca gerada em assets/brand/');
