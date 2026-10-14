// Limpa e normaliza as poses do mascote vetorizadas no Figma (assets/_source/mascot/raw-*.svg).
// Uso: pnpm mascot:build
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const SRC = new URL('../assets/_source/mascot/', import.meta.url).pathname;
const OUT = new URL('../assets/mascot/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

/** arquivo bruto → pose(s) */
const ARQUIVOS = { 4: 'escovando', 5: 'fio-dental', 6: 'joinha', 7: 'comemorando', 8: 'pensando', 9: 'frontal', 10: 'rostos' };
const ROSTOS = { 'rosto-feliz': [0, 0], 'rosto-serio': [1, 0], 'rosto-rindo': [0, 1], 'rosto-triste': [1, 1] }; // [coluna, linha]
const MIN_PX = 2.5; // descarta manchinhas menores que isso

const parse = (svg) => [...svg.matchAll(/<path d="([^"]+)" fill="([^"]+)"\/>/g)].map((m) => ({ d: m[1], fill: m[2].toLowerCase() }));

function bbox(d) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, cmd = '', nums = [];
  const flush = () => {
    if (cmd === 'H') nums.forEach((n) => { x0 = Math.min(x0, n); x1 = Math.max(x1, n); });
    else if (cmd === 'V') nums.forEach((n) => { y0 = Math.min(y0, n); y1 = Math.max(y1, n); });
    else for (let i = 0; i + 1 < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
  };
  for (const t of d.match(/[MLHVCZ]|-?\d*\.?\d+/g)) { if (/[MLHVCZ]/.test(t)) { flush(); cmd = t; nums = []; } else nums.push(parseFloat(t)); }
  flush();
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
const round = (d) => d.replace(/-?\d*\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10));
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

// 1) ler tudo, filtrar artefatos
const dados = {};
for (const n of Object.keys(ARQUIVOS)) {
  const todos = parse(readFileSync(`${SRC}raw-${n}.svg`, 'utf8'));
  dados[n] = todos
    .filter((p) => !['black', '#000', '#000000'].includes(p.fill))
    .map((p) => ({ ...p, b: bbox(p.d) }))
    .filter((p) => Math.max(p.b.w, p.b.h) >= MIN_PX);
}

// 2) paleta única: une só tons quase idênticos (raio R), preservando sombras e brilhos distintos
const R = 20;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const peso = new Map();
for (const p of Object.values(dados).flat()) peso.set(p.fill, (peso.get(p.fill) ?? 0) + Math.max(1, p.b.w * p.b.h));
const cent = [];
for (const [hex] of [...peso].sort((a, b) => b[1] - a[1])) {
  const c = hex2rgb(hex);
  if (!cent.some((q) => dist(q, c) <= R)) cent.push(c);
}
const snap = (hex) => { const c = hex2rgb(hex); let bi = 0, bd = 1e12; cent.forEach((q, i) => { const d = dist(q, c); if (d < bd) { bd = d; bi = i; } }); return rgb2hex(cent[bi]); };
const paleta = [...new Set(cent.map(rgb2hex))];

// 3) montar SVGs (com selagem de frestas) e recortar justo
const svgDe = (list, vb = '0 0 980 980', extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none">${list
    .map((p) => { const f = snap(p.fill); return `<path d="${round(p.d)}" fill="${f}" stroke="${f}" stroke-width="0.4" stroke-linejoin="round"/>`; })
    .join('')}${extra}</svg>\n`;

/** bbox real do desenho: varre o canal alfa de uma renderização 980×980 (1 unidade = 1 px). */
async function limites(svg) {
  const { data, info } = await sharp(Buffer.from(svg), { density: 72 }).resize(980, 980).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  return { x0, y0, x1: x1 + 1, y1: y1 + 1 };
}

async function salvar(nome, list, extra = '') {
  const b = await limites(svgDe(list, '0 0 980 980', extra));
  const pad = 8;
  const x = Math.max(0, b.x0 - pad), y = Math.max(0, b.y0 - pad);
  const w = b.x1 - b.x0 + pad * 2, h = b.y1 - b.y0 + pad * 2;
  const svg = svgDe(list, `${x} ${y} ${w} ${h}`, extra).replace('<svg ', `<svg width="${w}" height="${h}" `);
  writeFileSync(`${OUT}${nome}.svg`, svg);
  await sharp(Buffer.from(svg), { density: 72 * 2 }).resize({ height: 768 }).png({ palette: true, quality: 92 }).toFile(`${OUT}${nome}.png`);
  return { nome, w, h, paths: list.length };
}


// ---- rostos "sério" e "triste": o trace dos olhos saiu ruidoso; redesenhamos com formas limpas ----
const COR = { corpo: snap('#4ec1af'), contorno: snap('#176061'), branco: snap('#f8f9f8'), pupila: snap('#176061'), brilho: '#ffffff', lagrima: snap('#b7edf2') };
const luma = (hex) => { const [r, g, b] = hex2rgb(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

async function refazerRosto(nome, grupo) {
  // remove lascas escuras muito finas (sobras do trace na borda)
  let list = grupo.filter((p) => !(luma(snap(p.fill)) < 90 && Math.min(p.b.w, p.b.h) < 5 && Math.max(p.b.w, p.b.h) > 12 && Math.max(p.b.w, p.b.h) < 80));
  if (nome !== 'rosto-serio' && nome !== 'rosto-triste') return list;
  const cab = await limites(svgDe(list));
  const W = cab.x1 - cab.x0, H = cab.y1 - cab.y0;
  const dentro = (p) => {
    const cx = (p.b.x0 + p.b.x1) / 2, cy = (p.b.y0 + p.b.y1) / 2;
    const fx = (cx - cab.x0) / W, fy = (cy - cab.y0) / H;
    return fy > 0.1 && fy < 0.41 && ((fx > 0.12 && fx < 0.49) || (fx > 0.51 && fx < 0.88)) && Math.max(p.b.w, p.b.h) < 0.34 * W;
  };
  if (process.env.DEBUG_ROSTO === nome) list.forEach((p, i) => { const fx = (((p.b.x0 + p.b.x1) / 2 - cab.x0) / W).toFixed(2), fy = (((p.b.y0 + p.b.y1) / 2 - cab.y0) / H).toFixed(2); if (fy < 0.5) console.log(i, snap(p.fill), 'fx', fx, 'fy', fy, 'w', Math.round(p.b.w), 'h', Math.round(p.b.h), dentro(p) ? 'REMOVE' : ''); });
  list = list.filter((p) => !dentro(p));
  const triste = nome === 'rosto-triste';
  const olho = (cx, cy, lado) => { // lado: -1 esquerdo, 1 direito
    const rx = 0.082 * W, ry = (triste ? 0.095 : 0.078) * W, pr = (triste ? 0.056 : 0.06) * W;
    const px = cx - lado * 0.012 * W, py = cy + (triste ? 0.012 : 0.004) * W;
    const sw = 0.02 * W;
    // sobrancelha: sério = desce para o centro; triste = sobe para o centro
    const bx0 = cx - 0.08 * W, bx1 = cx + 0.08 * W, by = cy - 0.115 * W;
    const dy = (triste ? -1 : 1) * (triste ? 0.045 : 0.03) * W;
    const [ya, yb] = lado < 0 ? [by - dy, by + dy] : [by + dy, by - dy];
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${COR.branco}" stroke="${COR.contorno}" stroke-width="${sw}"/>` +
      `<circle cx="${px}" cy="${py}" r="${pr}" fill="${COR.pupila}"/>` +
      `<circle cx="${px - 0.02 * W}" cy="${py - 0.025 * W}" r="${0.019 * W}" fill="${COR.brilho}"/>` +
      `<circle cx="${px + 0.022 * W}" cy="${py + 0.022 * W}" r="${0.009 * W}" fill="${COR.brilho}"/>` +
      `<path d="M${bx0} ${ya}Q${cx} ${by + (triste ? -0.02 : 0.02) * W} ${bx1} ${yb}" stroke="${COR.contorno}" stroke-width="${sw * 1.1}" stroke-linecap="round" fill="none"/>`;
  };
  const cy = cab.y0 + 0.285 * H + 0.075 * W;
  // cobre os rabiscos do trace (pálpebras) com a cor do corpo antes de desenhar os olhos novos
  const remendo = (cx) => `<ellipse cx="${cx}" cy="${cy - 0.03 * W}" rx="${0.13 * W}" ry="${0.15 * W}" fill="${COR.corpo}"/>`;
  let extra = remendo(cab.x0 + 0.28 * W) + remendo(cab.x0 + 0.72 * W) + olho(cab.x0 + 0.28 * W, cy, -1) + olho(cab.x0 + 0.72 * W, cy, 1);
  if (triste) extra += `<path d="M${cab.x0 + 0.76 * W} ${cy + 0.1 * W}q${0.028 * W} ${0.055 * W} 0 ${0.075 * W}q${-0.028 * W} ${-0.02 * W} 0 ${-0.075 * W}z" fill="${COR.lagrima}" stroke="${COR.contorno}" stroke-width="${0.008 * W}" stroke-linejoin="round"/>`;
  return { list, extra };
}

// ---- comemorando: troca os dentinhos do trace (deformados) pelas ilustrações do kit ----
const ILUS = new URL('../assets/illustrations/', import.meta.url).pathname;
function dente(nome, cx, cy, tam, giro) {
  const svg = readFileSync(`${ILUS}${nome}.svg`, 'utf8');
  const vb = svg.match(/viewBox="([^"]+)"/)[1];
  const miolo = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<g transform="rotate(${giro} ${cx} ${cy})"><svg x="${cx - tam / 2}" y="${cy - tam / 2}" width="${tam}" height="${tam}" viewBox="${vb}" overflow="visible">${miolo}</svg></g>`;
}
function trocarDentes(list) {
  const caixas = [[30, 145, 175, 290], [795, 115, 932, 262]];
  const fora = list.filter((p) => {
    const cx = (p.b.x0 + p.b.x1) / 2, cy = (p.b.y0 + p.b.y1) / 2;
    return !caixas.some(([x0, y0, x1, y1]) => cx > x0 && cx < x1 && cy > y0 && cy < y1);
  });
  return { list: fora, extra: dente('dente-feliz', 103, 215, 150, -14) + dente('dente-bochechas', 865, 190, 150, 14) };
}

const rel = [];
for (const [n, nome] of Object.entries(ARQUIVOS)) {
  if (nome === 'comemorando') { const t = trocarDentes(dados[n]); rel.push(await salvar(nome, t.list, t.extra)); continue; }
  if (nome !== 'rostos') { rel.push(await salvar(nome, dados[n])); continue; }
  for (const [rosto, [col, lin]] of Object.entries(ROSTOS)) {
    const grupo = dados[n].filter((p) => ((p.b.x0 + p.b.x1) / 2 < 490 ? 0 : 1) === col && ((p.b.y0 + p.b.y1) / 2 < 470 ? 0 : 1) === lin);
    const r = await refazerRosto(rosto, grupo);
    rel.push(Array.isArray(r) ? await salvar(rosto, r) : await salvar(rosto, r.list, r.extra));
  }
}
// proporções (largura/altura) de cada arte, para o app dimensionar sem cortar
const PROP = new URL('../packages/shared/src/data/mascote-proporcoes.ts', import.meta.url).pathname;
writeFileSync(PROP, `// GERADO por scripts/build-mascot.mjs. Não edite.\n/** largura / altura de cada arquivo em assets/mascot */\nexport const MASCOTE_PROPORCAO: Record<string, number> = ${JSON.stringify(Object.fromEntries(rel.map((r) => [r.nome, Math.round((r.w / r.h) * 1000) / 1000])), null, 2)};\n`);

// cópias PNG para o app mobile (Metro precisa dos assets dentro do projeto)
const MOBILE = new URL('../apps/mobile/assets/mascote/', import.meta.url).pathname;
mkdirSync(MOBILE, { recursive: true });
for (const r of rel) copyFileSync(`${OUT}${r.nome}.png`, `${MOBILE}${r.nome}.png`);

try {
  execFileSync('rm', ['-f', `${OUT}sorriso-mascote.zip`]);
  execFileSync('zip', ['-q', `${OUT}sorriso-mascote.zip`, ...rel.flatMap((r) => [`${r.nome}.svg`, `${r.nome}.png`])], { cwd: OUT });
} catch { console.warn('zip indisponível'); }
console.table(rel);
console.log(`Paleta unificada: ${paleta.length} cores`);
