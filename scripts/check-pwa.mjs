// Verifica o PWA de produção: manifest, ícones, service worker, offline e ausência de mocks no bundle.
// Uso: pnpm pwa:check   (faz o build e sobe o preview em 4173)
import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const URL_ = 'http://localhost:4173';
const falhas = [];
const ok = (c, msg) => { console.log(`${c ? 'ok   ' : 'FALHA'} ${msg}`); if (!c) falhas.push(msg); };

execSync('pnpm --filter @sorriso/web build', { stdio: 'inherit' });
const prev = spawn('pnpm', ['--filter', '@sorriso/web', 'exec', 'vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 4000));

try {
  const dist = new URL('../apps/web/dist/', import.meta.url).pathname;
  const js = readdirSync(`${dist}assets`).filter((f) => f.endsWith('.js')).map((f) => readFileSync(`${dist}assets/${f}`, 'utf8')).join('\n');
  ok(!/createMockFetch|mock-access|DENTE2/.test(js), 'bundle de produção sem código de mock');
  ok(existsSync(`${dist}sw.js`) && existsSync(`${dist}manifest.webmanifest`), 'sw.js e manifest.webmanifest gerados');

  const m = JSON.parse(readFileSync(`${dist}manifest.webmanifest`, 'utf8'));
  for (const k of ['id', 'name', 'short_name', 'description', 'lang', 'scope', 'start_url', 'display', 'theme_color', 'background_color', 'categories', 'shortcuts', 'screenshots']) ok(m[k] != null, `manifest.${k}`);
  ok(m.icons.some((i) => i.sizes === '192x192') && m.icons.some((i) => i.sizes === '512x512' && i.purpose === 'any') && m.icons.some((i) => i.purpose === 'maskable'), 'ícones 192, 512 e maskable');
  for (const i of [...m.icons, ...m.screenshots, ...m.shortcuts.flatMap((s) => s.icons)]) ok(existsSync(`${dist}${i.src.slice(1)}`), `arquivo existe: ${i.src}`);

  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(URL_, { waitUntil: 'networkidle' });
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.waitForTimeout(2500);
  ok(await p.evaluate(() => !!navigator.serviceWorker.controller) || (await p.reload(), await p.evaluate(() => !!navigator.serviceWorker.controller)), 'service worker controlando a página');
  ok((await p.evaluate(() => caches.keys())).some((k) => k.includes('precache')), 'precache criado');

  await ctx.setOffline(true);
  for (const rota of ['/', '/ajuda', '/legal', '/entrar', '/sala']) {
    await p.goto(`${URL_}${rota}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(800);
    ok((await p.locator('#root').innerHTML()).length > 200, `offline abre ${rota}`);
  }
  ok(erros.length === 0, `sem erros de JS${erros.length ? ': ' + erros[0] : ''}`);
  await b.close();
} finally { prev.kill(); }
console.log(falhas.length ? `\n${falhas.length} falha(s).` : '\nPWA ok.');
process.exit(falhas.length ? 1 : 0);
