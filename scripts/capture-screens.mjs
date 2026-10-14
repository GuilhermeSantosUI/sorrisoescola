// Captura as telas do web e do app (via react-native-web) para docs/screens/, usando os dados de demonstração.
// Uso: pnpm screens   (web em WEB_URL, app mobile web em MOBILE_URL)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const WEB = process.env.WEB_URL ?? 'http://localhost:4173';
const MOBILE = process.env.MOBILE_URL ?? 'http://localhost:8099';
const OUT = new URL('../docs/screens/', import.meta.url).pathname;
for (const d of ['web', 'web-celular', 'mobile']) mkdirSync(`${OUT}${d}`, { recursive: true });

const b = await chromium.launch();
const erros = [];
const nova = async (viewport, escala = 1) => {
  const ctx = await b.newContext({ viewport, deviceScaleFactor: escala, colorScheme: 'dark' }); // SO escuro de propósito: o app é só tema claro
  const p = await ctx.newPage();
  p.on('pageerror', (e) => erros.push(`${p.url()}: ${e.message}`));
  return p;
};
const foto = async (p, pasta, nome, cheia = false) => { await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}${pasta}/${nome}.png`, fullPage: cheia }); console.log('ok', pasta, nome); };
const rolarTudo = async (p) => { const h = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < h; y += 500) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(120); } await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600); };

// ---------- WEB (desktop e celular) ----------
async function web(viewport, pasta) {
  const p = await nova(viewport);
  await p.goto(WEB); await p.waitForTimeout(2500); await rolarTudo(p); await foto(p, pasta, '01-landing', true);
  await p.goto(`${WEB}/entrar`); await foto(p, pasta, '02-entrar');
  await p.fill('#email', 'professora@exemplo.com'); await p.getByRole('button', { name: /Receber código/ }).click();
  await p.waitForSelector('#codigo'); await p.fill('#codigo', '123456'); await p.getByRole('button', { name: /^Entrar/ }).click();
  await p.waitForURL('**/professor'); await p.waitForTimeout(1800); await foto(p, pasta, '03-professor', true);
  for (const [rota, nome] of [['/professor/turma', '04-turma'], ['/professor/alunos', '05-alunos'], ['/professor/resultados', '06-resultados']]) { await p.goto(`${WEB}${rota}`); await p.waitForTimeout(1200); await foto(p, pasta, nome, true); }
  await p.goto(`${WEB}/professor/alunos`); await p.waitForTimeout(1000); await p.getByRole('button').filter({ hasText: 'Leo' }).first().click(); await foto(p, pasta, '05b-aluno-detalhe');
  await p.goto(`${WEB}/sala?modulo=escovacao`); await foto(p, pasta, '07-sala');
  await p.goto(`${WEB}/responsaveis`); await foto(p, pasta, '08-responsaveis', true);
  await p.fill('#codigo', 'PAPA23'); await p.locator('#consent').click(); await p.getByRole('button', { name: /Acompanhar/ }).click();
  await p.waitForURL('**/acompanhamento'); await p.waitForTimeout(1000); await foto(p, pasta, '09-acompanhamento', true);
  for (const [rota, nome] of [['/conteudo', '10-conteudo'], ['/ajuda', '11-ajuda'], ['/legal', '12-legal'], ['/design-system', '13-design-system']]) { await p.goto(`${WEB}${rota}`); await p.waitForTimeout(1000); await foto(p, pasta, nome, true); }
  await p.goto(`${WEB}/marca`); await p.waitForTimeout(1500); await rolarTudo(p); await foto(p, pasta, '14-marca', true);
  await p.context().close();
}

// ---------- APP (react-native-web, 390x844 @2x) ----------
async function app() {
  const p = await nova({ width: 390, height: 844 }, 2);
  const botao = (nome) => p.getByRole('button', { name: nome }).first();
  await p.goto(MOBILE); await p.waitForTimeout(2500); await foto(p, 'mobile', '01-perfil', true);

  // professor
  await p.goto(`${MOBILE}/entrar-professor`); await p.waitForTimeout(800);
  await p.getByTestId('campo-email').fill('professora@exemplo.com'); await botao(/Receber código/).click();
  await p.getByTestId('campo-codigo').waitFor(); await p.getByTestId('campo-codigo').fill('123456'); await foto(p, 'mobile', '02-entrar-professor');
  await botao(/^Entrar/).click(); await p.waitForURL('**/painel'); await p.waitForTimeout(1500); await foto(p, 'mobile', '03-painel', true);
  await p.getByRole('tab', { name: /Conduzir/ }).click(); await foto(p, 'mobile', '04-conduzir', true);
  await p.getByRole('tab', { name: /Turma/ }).click(); await p.waitForTimeout(800); await foto(p, 'mobile', '05-turma', true);
  await p.getByRole('button', { name: /Abrir Leo/ }).click(); await foto(p, 'mobile', '06-aluno-detalhe', true);
  await botao(/Fechar/).click();
  await p.getByRole('tab', { name: /Resultados/ }).click(); await p.waitForTimeout(800); await foto(p, 'mobile', '07-resultados', true);
  await p.goto(`${MOBILE}/aula/escovacao`); await p.waitForTimeout(1200); await foto(p, 'mobile', '08-aula-video');
  // avança: vídeo (sem botão de avançar próprio) → o app mostra aviso; abre direto o passo seguinte pelo botão "Avançar"
  await botao(/Avançar/).click().catch(() => {}); await p.waitForTimeout(600); await foto(p, 'mobile', '09-aula-passos');
  await p.goto(`${MOBILE}/painel`); await p.waitForTimeout(800);
  await botao(/Sair/).click(); await p.waitForTimeout(800);

  // criança
  await p.goto(`${MOBILE}/entrar-aluno`); await p.waitForTimeout(600);
  await p.getByTestId('campo-turma').fill('DENTE2'); await p.getByTestId('campo-apelido').fill('Duda'); await foto(p, 'mobile', '10-entrar-aluno');
  await botao(/^Entrar/).click(); await p.waitForURL('**/inicio'); await p.waitForTimeout(1200); await foto(p, 'mobile', '11-aluno-inicio', true);
  await p.getByRole('tab', { name: /Aprender/ }).click(); await foto(p, 'mobile', '12-aprender', true);
  await p.goto(`${MOBILE}/modulo/escovacao`); await p.waitForTimeout(1000); await foto(p, 'mobile', '13-modulo', true);
  await p.goto(`${MOBILE}/tutorial?modulo=escovacao&i=1`); await p.waitForTimeout(1000); await foto(p, 'mobile', '14-tutorial');
  await p.goto(`${MOBILE}/jogo?modulo=escovacao&i=2`); await p.waitForTimeout(1000); await foto(p, 'mobile', '15-jogo-limpeza', true);
  await p.goto(`${MOBILE}/jogo?modulo=alimentacao-carie&i=0`); await p.waitForTimeout(1000); await foto(p, 'mobile', '16-jogo-alimentos', true);
  await p.goto(`${MOBILE}/quiz?modulo=escovacao&i=3`); await p.waitForTimeout(1000); await foto(p, 'mobile', '17-quiz');
  for (let k = 0; k < 4; k++) { await botao(/^1/).click().catch(() => {}); await p.waitForTimeout(250); }
  await foto(p, 'mobile', '18-quiz-resultado', true);
  await p.goto(`${MOBILE}/escovar`); await p.waitForTimeout(800); await foto(p, 'mobile', '19-escovar');
  await p.goto(`${MOBILE}/conquistas`); await p.waitForTimeout(800); await foto(p, 'mobile', '20-conquistas', true);
  await p.goto(`${MOBILE}/inicio`); await p.waitForTimeout(600); await botao(/Sair/).click(); await p.waitForTimeout(600);

  // responsável
  await p.goto(`${MOBILE}/entrar-responsavel`); await p.waitForTimeout(800);
  await p.getByTestId('campo-responsavel').fill('PAPA23'); await p.getByRole('checkbox').click(); await foto(p, 'mobile', '21-entrar-responsavel', true);
  await botao(/Acompanhar/).click(); await p.waitForURL('**/acompanhamento'); await p.waitForTimeout(1200); await foto(p, 'mobile', '22-acompanhamento', true);
  await p.evaluate(() => localStorage.clear());

  for (const [rota, nome] of [['/ajuda', '23-ajuda'], ['/legal', '24-legal'], ['/marca', '25-marca'], ['/design-system', '26-design-system']]) { await p.goto(`${MOBILE}${rota}`); await p.waitForTimeout(1200); await foto(p, 'mobile', nome, true); }
  await p.context().close();
}

await web({ width: 1280, height: 800 }, 'web');
await web({ width: 390, height: 844 }, 'web-celular');
await app();
await b.close();
console.log(erros.length ? `\nErros de JavaScript:\n${erros.join('\n')}` : '\nSem erros de JavaScript.');
process.exit(erros.length ? 1 : 0);
