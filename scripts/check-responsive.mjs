// Auditoria de responsividade do web: todas as rotas em 7 larguras.
// Mede: estouro horizontal, alvos de toque pequenos e texto pequeno. Sai com erro se achar problema.
// Uso: pnpm responsive   (web em dev, com dados de demonstração, em WEB_URL)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const WEB = process.env.WEB_URL ?? 'http://localhost:5173';
const OUT = new URL('../docs/screens/responsivo/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [[320, 568], [375, 667], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1920, 1080]];
const ROTAS = ['/', '/entrar', '/professor', '/professor/turma', '/professor/alunos', '/professor/resultados', '/sala?modulo=escovacao', '/responsaveis', '/responsaveis/acompanhamento', '/conteudo', '/ajuda', '/legal', '/marca', '/design-system'];
const ALVO_MIN = 44; // px; o produto usa 48, aceitamos 44 de tolerância de arredondamento
const FONTE_MIN = 12;

const b = await chromium.launch();
const problemas = [];

async function entrar(p) {
  await p.goto(`${WEB}/entrar`); await p.waitForTimeout(500);
  await p.fill('#email', 'professora@exemplo.com'); await p.getByRole('button', { name: /Receber código/ }).click();
  await p.waitForSelector('#codigo'); await p.fill('#codigo', '123456'); await p.getByRole('button', { name: /^Entrar/ }).click();
  await p.waitForURL('**/professor');
  await p.goto(`${WEB}/responsaveis`); await p.fill('#codigo', 'PAPA23'); await p.locator('#consent').click();
  await p.getByRole('button', { name: /Acompanhar/ }).click(); await p.waitForURL('**/acompanhamento');
}

for (const [w, h] of VIEWPORTS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: w < 1024, colorScheme: 'dark' });
  const p = await ctx.newPage();
  await entrar(p);
  for (const rota of ROTAS) {
    await p.goto(`${WEB}${rota}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
    const r = await p.evaluate(({ ALVO_MIN, FONTE_MIN }) => {
      const vw = document.documentElement.clientWidth;
      const visivel = (e) => { const cs = getComputedStyle(e); const rc = e.getBoundingClientRect(); return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.01 && rc.width > 0 && rc.height > 0; };
      const dentroDeRolagem = (e) => { for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) { const o = getComputedStyle(n).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return true; } return false; };
      const estouro = [...document.querySelectorAll('body *')].filter((e) => visivel(e) && !dentroDeRolagem(e) && e.getBoundingClientRect().right > vw + 1 && !e.closest('[aria-hidden="true"]'))
        .slice(0, 4).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 2).join('.')} (direita ${Math.round(e.getBoundingClientRect().right)} > ${vw})`);
      const alvos = [...document.querySelectorAll('button, input:not([type=hidden]), select, textarea, [role=tab], summary, nav a, header a, footer a')]
        .filter((e) => visivel(e) && e.getAttribute('role') !== 'checkbox' && !e.closest('[aria-hidden="true"]') && !e.closest('p, li > span'))
        .filter((e) => { const rc = e.getBoundingClientRect(); return Math.min(rc.width, rc.height) < ALVO_MIN && !(e.tagName === 'A' && e.closest('footer')); })
        .slice(0, 5).map((e) => `${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24)}" ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
      const pequenos = [...document.querySelectorAll('body *')].filter((e) => visivel(e) && [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < FONTE_MIN && !e.closest('svg'))
        .slice(0, 3).map((e) => `"${e.textContent.trim().slice(0, 24)}" ${getComputedStyle(e).fontSize}`);
      return { estouroPagina: document.documentElement.scrollWidth > vw + 1, estouro, alvos, pequenos };
    }, { ALVO_MIN, FONTE_MIN });
    const id = `${w}px ${rota}`;
    if (r.estouroPagina) problemas.push(`ROLAGEM HORIZONTAL  ${id}  ${r.estouro.join('; ')}`);
    for (const a of r.alvos) problemas.push(`ALVO PEQUENO       ${id}  ${a}`);
    for (const t of r.pequenos) problemas.push(`TEXTO PEQUENO      ${id}  ${t}`);
    if (rota === '/' || rota === '/sala?modulo=escovacao' || rota === '/professor') await p.screenshot({ path: `${OUT}${w}-${rota.replace(/[^a-z]/g, '') || 'home'}.png`, fullPage: rota !== '/sala?modulo=escovacao' });
  }
  await ctx.close();
}
await b.close();
const unicos = [...new Set(problemas)];
console.log(unicos.join('\n') || 'Nenhum problema de responsividade.');
console.log(`\n${unicos.length} ocorrências em ${ROTAS.length} rotas x ${VIEWPORTS.length} larguras.`);
process.exit(unicos.length ? 1 : 0);
