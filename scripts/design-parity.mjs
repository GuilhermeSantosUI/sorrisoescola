// Compara os estilos RENDERIZADOS do web e do app (via react-native-web) nos mesmos componentes.
// Uso: pnpm design:parity   (precisa do web em WEB_URL e do app mobile web em MOBILE_URL)
import { chromium } from 'playwright';

const WEB = process.env.WEB_URL ?? 'http://localhost:4173';
const MOBILE = process.env.MOBILE_URL ?? 'http://localhost:8099';

const CAIXA = ['backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderTopLeftRadius', 'minHeight', 'paddingLeft', 'paddingTop', 'rowGap'];
const TEXTO = ['fontSize', 'fontWeight', 'fontFamily', 'color'];
const ALVOS = {
  'ds-button-default': { caixa: CAIXA, texto: TEXTO },
  'ds-button-outline': { caixa: CAIXA, texto: TEXTO },
  'ds-button-secondary': { caixa: CAIXA, texto: TEXTO },
  'ds-button-lg': { caixa: CAIXA, texto: TEXTO },
  'ds-badge-default': { caixa: CAIXA.filter((k) => k !== 'rowGap'), texto: TEXTO },
  'ds-badge-secondary': { caixa: CAIXA.filter((k) => k !== 'rowGap'), texto: TEXTO },
  'ds-badge-outline': { caixa: CAIXA.filter((k) => k !== 'rowGap'), texto: TEXTO },
  'ds-card': { caixa: ['backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderTopLeftRadius', 'paddingLeft', 'paddingTop', 'rowGap'] },
  'ds-progress': { caixa: ['borderTopWidth', 'borderTopColor', 'borderTopLeftRadius', 'height', 'backgroundColor'] },
  'ds-input': { caixa: ['backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderTopLeftRadius', 'height', 'paddingLeft'], texto: ['fontSize', 'fontFamily'] },
  'ds-titulo': { texto: ['fontSize', 'fontFamily', 'color'] },
  'ds-texto': { texto: ['fontSize', 'fontFamily', 'color'] },
};

async function medir(page, url) {
  await page.goto(`${url}/design-system`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="ds-card"]', { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  return page.evaluate(({ alvos }) => {
    const out = {};
    for (const [id, cfg] of Object.entries(alvos)) {
      const el = document.querySelector(`[data-testid="${id}"]`);
      if (!el) { out[id] = null; continue; }
      const cs = getComputedStyle(el);
      const r = {};
      for (const k of cfg.caixa ?? []) r[k] = cs[k];
      if (cfg.texto) {
        // elemento que realmente carrega o texto: o próprio ou o último descendente com texto
        const comTexto = [...el.querySelectorAll('*')].filter((n) => n.childNodes.length && [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())).pop() ?? el;
        const ts = getComputedStyle(comTexto.tagName === 'INPUT' ? el : comTexto);
        for (const k of cfg.texto) r[`texto.${k}`] = ts[k];
      }
      out[id] = r;
    }
    return out;
  }, { alvos: ALVOS });
}

// Normaliza fontes do RN (Nunito_700Bold) para família + peso, como no CSS do web.
function norm(chave, v) {
  if (v == null) return v;
  if (chave.endsWith('fontFamily')) {
    const f = v.split(',')[0].replace(/["']/g, '').trim();
    const m = /^(Baloo2|Nunito)_(\d+)/.exec(f);
    return m ? `${m[1] === 'Baloo2' ? 'Baloo 2' : 'Nunito'}` : f;
  }
  if (chave.endsWith('fontWeight')) return String(v);
  if (/^[\d.]+px$/.test(v)) return `${Math.round(parseFloat(v) * 10) / 10}px`;
  return v;
}
const pesoDaFamilia = (v) => { const m = /(Baloo2|Nunito)_(\d+)/.exec(v ?? ''); return m ? m[2] : null; };

const b = await chromium.launch();
const web = await medir(await b.newPage({ viewport: { width: 1000, height: 1400 } }), WEB);
const mob = await medir(await b.newPage({ viewport: { width: 420, height: 2400 } }), MOBILE);
await b.close();

let falhas = 0, ok = 0;
for (const [id, regras] of Object.entries(web)) {
  const m = mob[id];
  if (!regras || !m) { console.log(`FALTA  ${id}`); falhas++; continue; }
  for (const k of Object.keys(regras)) {
    if (k === 'borderTopColor' && regras.borderTopWidth === '0px') continue; // sem borda, a cor não existe
    const a = norm(k, regras[k]);
    let c = norm(k, m[k]);
    // RN guarda o peso no nome da fonte; o web, no font-weight
    if (k.endsWith('fontWeight')) {
      const fam = pesoDaFamilia(m[k.replace('fontWeight', 'fontFamily')]);
      c = fam ?? c;
    }
    if (a === c || (k.endsWith('fontWeight') && ((a === '700' && c === '700') || (a === '800' && c === '800')))) { ok++; continue; }
    if (k === 'minHeight' && a === 'auto') { ok++; continue; }
    console.log(`DIFERE ${id} ${k}: web=${a} app=${c}`);
    falhas++;
  }
}
console.log(`\n${ok} propriedades iguais, ${falhas} divergências.`);
process.exit(falhas ? 1 : 0);
