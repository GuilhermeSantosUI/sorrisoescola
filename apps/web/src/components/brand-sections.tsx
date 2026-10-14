import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  AA_LARGE, AA_NORMAL, brand, colors, contrastRatio, fontSizes, hexToCmyk, hexToRgb,
  ilustracoes, expressoes, modulos, palette, paresContraste, poses, variacoesLogo,
} from '@sorriso/shared';
import { Badge, Button, Card, ICONES, Icone, ProgressBar, type IconeNome } from './ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Check, Flame, House, Lock, Smiley, Star, Timer, Trophy } from '@phosphor-icons/react';
import { Ilustracao } from './ilustracao';
import { Mascot, MascoteRosto } from './mascot';
import { Confete, Decoracao, Estrelas } from './efeitos';
import { TiltCard } from './tilt-card';
import { gsap } from '../lib/motion';

export const SECOES = [
  ['apresentacao', 'Apresentação'], ['logo', 'Logo'], ['cores', 'Cores'], ['tipografia', 'Tipografia'],
  ['iconografia', 'Ícones'], ['ilustracao', 'Ilustração'], ['kit', 'Kit'], ['movimento', 'Movimento'], ['aplicacao', 'Aplicação'], ['downloads', 'Downloads'],
] as const;

const Secao = ({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) => (
  <section id={id} aria-labelledby={`${id}-t`} className="mt-16">
    <h2 id={`${id}-t`} data-reveal className="text-2xl">{titulo}</h2>
    <div className="mt-4 grid gap-4">{children}</div>
  </section>
);

const arquivo = (nome: string, ext: 'svg' | 'png') => `/brand/${nome}.${ext}`;
const xadrez: CSSProperties = {
  backgroundImage: `conic-gradient(${colors.neve} 25%, ${colors.branco} 0 50%, ${colors.neve} 0 75%, ${colors.branco} 0)`,
  backgroundSize: '24px 24px',
};
const LinkBaixar = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className="inline-flex min-h-touch items-center gap-2 rounded-full border-2 border-petroleo bg-branco px-4 font-bold transition-colors hover:bg-turquesa" href={href} download>
    <Icone nome="baixar" size={22} /> {children}
  </a>
);

export function Capa() {
  return (
    <header className="relative overflow-hidden rounded-lg border-2 border-petroleo bg-neve p-8 shadow-forte">
      <Decoracao />
      <div className="relative flex flex-wrap items-center gap-8">
        <img data-capa="logo" src={arquivo('logo-completa', 'svg')} alt="Logo completa do Sorriso na Escola" width={200} height={200} className="rounded-lg shadow-forte" />
        <div className="min-w-64 flex-1">
          <p data-capa="kicker" className="font-bold">Livro de marca</p>
          <h1 data-capa="titulo" className="text-3xl">{brand.nome}</h1>
          <p data-capa="texto" className="mt-3 text-lg">{brand.proposito}</p>
        </div>
      </div>
    </header>
  );
}

export function NavMarca() {
  return (
    <nav aria-label="Seções do livro de marca" className="sticky top-[4.6rem] z-30 mt-6 rounded-3xl border-2 border-petroleo bg-branco/95 p-1 backdrop-blur">
      <ul className="flex flex-wrap justify-center gap-x-0.5">
        {SECOES.map(([id, nome]) => (
          <li key={id}><a data-nav={id} href={`#${id}`} className="inline-flex min-h-touch min-w-12 items-center justify-center rounded-full px-2 text-sm font-bold transition-colors hover:bg-neve [&.ativo]:bg-limao">{nome}</a></li>
        ))}
      </ul>
    </nav>
  );
}

export function Apresentacao() {
  return (
    <Secao id="apresentacao" titulo="Apresentação">
      <p data-reveal className="text-lg">{brand.proposito}</p>
      <p data-reveal className="text-lg">{brand.ilustracao}</p>
    </Secao>
  );
}

function DiagramaProtecao() {
  // logo 240px; x = um dente ≈ 1/8 da altura = 30px
  return (
    <svg data-reveal viewBox="0 0 400 400" role="img" aria-label="Diagrama: margem livre x igual à altura de um dente ao redor do logo" className="mx-auto w-full max-w-sm">
      <rect x="2" y="2" width="396" height="396" rx="24" fill={colors.neve} stroke={colors.petroleo} strokeWidth="2" />
      <rect data-draw pathLength={1} x="50" y="50" width="300" height="300" fill="none" stroke={colors.erro} strokeWidth="3" strokeDasharray="1" strokeDashoffset="0" />
      <image href={arquivo('logo-completa', 'svg')} x="80" y="80" width="240" height="240" />
      {[50, 320].map((x) => (
        <g key={x}>
          <line x1={x} y1="200" x2={x + 30} y2="200" stroke={colors.erro} strokeWidth="3" />
          <text x={x + 15} y="190" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="22" fill={colors.erro}>x</text>
        </g>
      ))}
      {[50, 320].map((y) => (
        <g key={y}>
          <line x1="200" y1={y} x2="200" y2={y + 30} stroke={colors.erro} strokeWidth="3" />
          <text x="214" y={y + 22} fontFamily="Baloo 2" fontWeight="800" fontSize="22" fill={colors.erro}>x</text>
        </g>
      ))}
    </svg>
  );
}

export function LogoMascote() {
  return (
    <Secao id="logo" titulo="Logo e mascote">
      <div className="grid gap-4 sm:grid-cols-2">
        {variacoesLogo.map((v) => (
          <TiltCard key={v.id} className="flex flex-col">
            <div data-reveal className="grid h-44 place-items-center rounded-md border-2 border-petroleo" style={xadrez}>
              <img src={arquivo(v.arquivo, 'svg')} alt={`Logo ${v.nome}`} className="max-h-36 max-w-[90%]" />
            </div>
            <h3 data-reveal className="mt-3 text-xl">{v.nome}</h3>
            <p data-reveal>{v.descricao}</p>
            <div data-reveal className="mt-3 flex flex-wrap gap-2"><LinkBaixar href={arquivo(v.arquivo, 'svg')}>SVG</LinkBaixar><LinkBaixar href={arquivo(v.arquivo, 'png')}>PNG</LinkBaixar></div>
          </TiltCard>
        ))}
      </div>

      <Card data-reveal>
        <h3 className="text-xl">Área de proteção</h3>
        <p>{brand.areaProtecao}</p>
        <DiagramaProtecao />
      </Card>

      <Card data-reveal>
        <h3 className="text-xl">Tamanho mínimo</h3>
        <p>Digital: {brand.tamanhoMinimo.digitalPx} px. Impressão: {brand.tamanhoMinimo.impressaoMm} mm. Abaixo de 48 px use o ícone reduzido.</p>
        <ul className="mt-3 flex flex-wrap items-end gap-6">
          {[24, 32, 48, 64, 96].map((px) => (
            <li key={px} className="text-center">
              <img src={arquivo(px < 48 ? 'logo-icone' : 'logo-completa', 'svg')} width={px} height={px} alt={`Logo a ${px} px`} className="mx-auto" />
              <span className="mt-1 block text-sm font-bold">{px} px{px === brand.tamanhoMinimo.digitalPx ? ' · mínimo' : ''}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card data-reveal>
        <h3 className="text-xl">Usos incorretos</h3>
        <ul className="mt-2 grid gap-4 sm:grid-cols-3">
          {brand.usosIncorretos.map((u) => {
            const estilo: Record<string, CSSProperties> = {
              distorcer: { transform: 'scaleX(1.7)' },
              cores: { filter: 'hue-rotate(150deg) saturate(2)' },
              girar: { transform: 'rotate(35deg)' },
              contraste: { opacity: 0.45 },
              sombra: { filter: `drop-shadow(8px 8px 4px ${colors.petroleoEscuro})` },
            };
            return (
              <li key={u.id} className="flex flex-col items-center gap-2 text-center">
                <div className={`relative grid h-28 w-full place-items-center overflow-hidden rounded-md border-2 border-petroleo ${u.id === 'contraste' ? 'bg-turquesa' : 'bg-branco'}`}>
                  <img src={arquivo('logo-sem-fundo', 'svg')} alt="" width={72} height={72} style={estilo[u.id]} />
                  <span className="absolute right-1 top-1 text-erro"><Icone nome="proibido" size={28} weight="fill" /></span>
                </div>
                <span>{u.texto}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card data-reveal>
        <h3 className="text-xl">Poses do mascote</h3>
        <p className="text-sm">Arte vetorial própria por pose. A pose frontal faz o papel de “acenando” até existir uma arte de aceno.</p>
        <ul className="mt-2 grid gap-4 sm:grid-cols-3">
          {poses.map((p) => (
            <li key={p.id} className="grid justify-items-center gap-1 text-center">
              <div className="grid h-48 place-items-end overflow-visible pb-1"><Mascot pose={p.id} size={150} /></div>
              <strong className="relative z-10 mt-2 block">{p.nome}</strong><span>{p.quando}</span>
              <span className="flex gap-2"><a className="text-xs font-bold underline" href={`/mascote/${p.arquivo}.svg`} download>SVG</a><a className="text-xs font-bold underline" href={`/mascote/${p.arquivo}.png`} download>PNG</a></span>
            </li>
          ))}
        </ul>
      </Card>

      <Card data-reveal>
        <h3 className="text-xl">Expressões</h3>
        <ul className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {expressoes.map((e) => (
            <li key={e.id} className="grid justify-items-center gap-1 text-center">
              <MascoteRosto nome={e.id} size={88} />
              <strong>{e.nome}</strong><span className="text-sm">{e.quando}</span>
              <span className="flex gap-2"><a className="text-xs font-bold underline" href={`/mascote/${e.arquivo}.svg`} download>SVG</a><a className="text-xs font-bold underline" href={`/mascote/${e.arquivo}.png`} download>PNG</a></span>
            </li>
          ))}
        </ul>
      </Card>
    </Secao>
  );
}

export function Cores() {
  const [copiado, setCopiado] = useState<string | null>(null);
  async function copiar(hex: string, el: HTMLElement) {
    gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    try { await navigator.clipboard.writeText(hex); setCopiado(hex); } catch { setCopiado(null); }
  }
  return (
    <Secao id="cores" titulo="Cores">
      <ul className="grid gap-4 sm:grid-cols-3">
        {palette.map((c) => {
          const [r, g, b] = hexToRgb(c.hex);
          return (
            <li key={c.name} data-reveal>
              <button type="button" onClick={(e) => void copiar(c.hex, e.currentTarget)} className="w-full overflow-hidden rounded-lg border-2 border-petroleo bg-branco text-left shadow-suave transition-shadow hover:shadow-forte" aria-label={`Copiar ${c.label} ${c.hex}`}>
                <span className="block h-24 border-b-2 border-petroleo" style={{ background: c.hex }} />
                <span className="block p-3">
                  <strong>{c.label}</strong> {c.apoio && <Badge>apoio, aprovar</Badge>}
                  <span className="block font-bold">{c.hex}</span>
                  <span className="block text-sm">RGB {r}, {g}, {b}</span>
                  <span className="block text-sm">CMYK {hexToCmyk(c.hex).join(', ')}</span>
                  <span className="block text-sm">{c.uso}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p role="status" className="flex min-h-6 items-center gap-2 font-bold">{copiado && <><Icone nome="ok" size={20} /> {copiado} copiado!</>}</p>

      <h3 data-reveal className="text-xl">Combinações de contraste</h3>
      <ul className="grid gap-3 sm:grid-cols-3">
        {paresContraste.map(([fg, bg]) => {
          const razao = contrastRatio(colors[fg], colors[bg]);
          const passa = razao >= AA_NORMAL;
          const nivel = passa ? 'Passa AA' : razao >= AA_LARGE ? 'Só texto grande' : 'Reprovado';
          return (
            <li key={`${fg}-${bg}`} data-reveal className="rounded-md border-2 border-petroleo p-3" style={{ background: colors[bg], color: colors[fg] }}>
              <strong className="text-lg">Aa texto</strong>
              <span className="block">{razao.toFixed(2)}:1: {nivel}</span>
              <span className="relative mt-2 block h-2 rounded-full" style={{ background: colors.branco }} aria-hidden="true">
                <span data-barra className="absolute inset-y-0 left-0 block origin-left rounded-full" style={{ width: `${Math.min(razao / 12, 1) * 100}%`, background: passa ? colors.petroleoEscuro : colors.erro }} />
                <span className="absolute -inset-y-1 block w-0.5" style={{ left: `${(AA_NORMAL / 12) * 100}%`, background: colors.petroleoEscuro }} />
              </span>
            </li>
          );
        })}
      </ul>
      <p data-reveal className="text-sm">A linha vertical marca o mínimo AA (4,5:1). Texto sobre cores da marca usa sempre o petróleo escuro.</p>
    </Secao>
  );
}

export function Tipografia() {
  return (
    <Secao id="tipografia" titulo="Tipografia">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card data-reveal>
          <p className="text-sm font-bold">Títulos: Baloo 2</p>
          <p className="font-titulo text-3xl" style={{ fontWeight: 800 }}>Aa Sorriso</p>
          {[600, 700, 800].map((w) => <p key={w} className="font-titulo text-xl" style={{ fontWeight: w }}>{w}: Escove com carinho</p>)}
        </Card>
        <Card data-reveal>
          <p className="text-sm font-bold">Texto: Nunito</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>Aa Dentes</p>
          {[400, 600, 700].map((w) => <p key={w} className="text-lg" style={{ fontWeight: w }}>{w}: Dois minutos, duas vezes ao dia</p>)}
        </Card>
      </div>
      <ul data-reveal className="grid gap-1">
        {Object.entries(fontSizes).filter(([k]) => k !== 'sala').map(([k, v]) => (
          <li key={k} style={{ fontSize: v }} className={k === 'base' || k === 'sm' ? '' : 'font-titulo font-extrabold'}>{k} · {v}px: Escove com carinho</li>
        ))}
      </ul>
      <p data-reveal className="text-sm">{brand.tipografia.titulo}. {brand.tipografia.texto}.</p>
    </Secao>
  );
}

export function Iconografia() {
  const [peso, setPeso] = useState<'regular' | 'bold' | 'duotone' | 'fill'>('bold');
  const nomes = Object.keys(ICONES) as IconeNome[];
  return (
    <Secao id="iconografia" titulo="Iconografia">
      <p data-reveal>Biblioteca: <strong>{brand.iconografia.biblioteca}</strong>.</p>
      <ul data-reveal className="list-disc pl-6">{brand.iconografia.regras.map((r) => <li key={r}>{r}</li>)}</ul>
      <div data-reveal className="flex flex-wrap gap-2" role="group" aria-label="Peso do ícone">
        {(['regular', 'bold', 'duotone', 'fill'] as const).map((p) => (
          <button key={p} type="button" aria-pressed={peso === p} onClick={() => setPeso(p)} className={`min-h-touch rounded-full border-2 border-petroleo px-4 font-bold ${peso === p ? 'bg-limao' : 'bg-branco'}`}>{p}</button>
        ))}
      </div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {nomes.map((n) => (
          <li key={n} data-reveal className="flex flex-col items-center gap-1 rounded-md border-2 border-petroleo bg-branco p-3 text-center">
            <Icone nome={n} size={36} weight={peso} />
            <span className="text-sm font-bold">{ICONES[n].rotulo}</span>
          </li>
        ))}
      </ul>
    </Secao>
  );
}

export function SecaoIlustracao() {
  const principios: { titulo: string; texto: string; visual: ReactNode }[] = [
    { titulo: 'Contornos grossos', texto: 'Contorno em petróleo, cerca de 5% do tamanho da peça, sempre fechado.', visual: <Ilustracao nome="dente-feliz" size={84} /> },
    { titulo: 'Sombras suaves', texto: 'Sombra difusa e curta; nunca preta nem deslocada.', visual: <span style={{ filter: `drop-shadow(0 8px 8px color-mix(in srgb, ${colors.petroleoEscuro} 30%, transparent))` }}><MascoteRosto nome="feliz" size={76} decorativo /></span> },
    { titulo: 'Formas arredondadas', texto: 'Círculos, pílulas e cantos generosos. Sem ângulos agudos.', visual: (
      <span className="flex items-end gap-2" aria-hidden="true">
        <span className="size-10 rounded-full bg-turquesa" /><span className="h-10 w-16 rounded-full bg-limao" /><span className="size-12 rounded-lg bg-amarelo-limao" />
      </span>) },
    { titulo: 'Cores saturadas', texto: 'Paleta da marca em fundos chapados; o contorno segura o contraste.', visual: (
      <span className="flex" aria-hidden="true">{palette.slice(0, 5).map((c) => <span key={c.name} className="size-9 first:rounded-l-full last:rounded-r-full" style={{ background: c.hex }} />)}</span>) },
  ];
  const estados: { id: 'dente-feliz' | 'dente-brilhando' | 'dente-triste' | 'dente-sujo'; nome: string; quando: string }[] = [
    { id: 'dente-feliz', nome: 'Feliz', quando: 'Estado padrão, acerto, item concluído.' },
    { id: 'dente-brilhando', nome: 'Brilhando', quando: 'Dente limpo, conquista desbloqueada.' },
    { id: 'dente-triste', nome: 'Triste', quando: 'Erro gentil, lista vazia, sem conexão.' },
    { id: 'dente-sujo', nome: 'Sujo', quando: 'Jogo de limpeza e aula sobre cárie.' },
  ];
  return (
    <Secao id="ilustracao" titulo="Ilustração">
      <p data-reveal className="text-lg">{brand.ilustracaoRegras}</p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principios.map((p) => (
          <li key={p.titulo} data-reveal>
            <Card className="h-full items-center text-center">
              <div className="grid h-24 place-items-center">{p.visual}</div>
              <h3 className="text-lg">{p.titulo}</h3>
              <p className="text-sm">{p.texto}</p>
            </Card>
          </li>
        ))}
      </ul>

      <Card data-reveal>
        <h3 className="text-xl">Estados do dentinho</h3>
        <ul className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {estados.map((e) => (
            <li key={e.id} className="grid justify-items-center gap-1 rounded-lg bg-neve p-3 text-center">
              <Ilustracao nome={e.id} size={92} alt={`Dente ${e.nome.toLowerCase()}`} />
              <strong>{e.nome}</strong><span className="text-sm">{e.quando}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card data-reveal className="overflow-hidden p-0">
          <div className="relative grid min-h-64 place-items-center bg-neve p-6 text-center">
            <Decoracao />
            <div className="relative grid justify-items-center gap-2">
              <Mascot pose="comemorando" size={150} decorativo />
              <p className="font-titulo text-2xl font-extrabold">Módulo concluído!</p>
            </div>
          </div>
          <p className="flex items-center gap-2 p-4 font-bold"><Icone nome="ok" size={22} /> Certo: decoração em capas e telas de celebração, com texto curto.</p>
        </Card>
        <Card data-reveal className="overflow-hidden p-0">
          <div className="relative min-h-64 bg-neve p-6">
            <Decoracao />
            <p className="relative text-sm">Texto longo sobre a técnica de escovação: posicione a escova inclinada, faça movimentos curtos e suaves e não esqueça da língua. Quando a decoração passa por trás de um parágrafo como este, ela compete com a leitura e atrapalha crianças com dificuldade de atenção.</p>
          </div>
          <p className="flex items-center gap-2 p-4 font-bold text-erro"><Icone nome="erro" size={22} /> Errado: decoração atrás de texto longo.</p>
        </Card>
      </div>
    </Secao>
  );
}

export function KitIlustracoes() {
  return (
    <Secao id="kit" titulo="Kit de ilustrações">
      <p data-reveal>Extraídas do vetor do mascote e adaptadas (dente triste, sujo e brilhando são novos). Contorno petróleo para funcionar em fundo claro.</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ilustracoes.map((il) => (
          <li key={il.id} data-reveal>
            <TiltCard className="grid h-full justify-items-center gap-1 p-3 text-center">
              <Ilustracao nome={il.id} size={96} alt={il.nome} />
              <strong className="text-sm">{il.nome}</strong>
              <span className="text-xs">{il.uso}</span>
              <span className="flex gap-1"><a className="text-xs font-bold underline" href={`/ilustracoes/${il.id}.svg`} download>SVG</a><a className="text-xs font-bold underline" href={`/ilustracoes/${il.id}.png`} download>PNG</a></span>
            </TiltCard>
          </li>
        ))}
      </ul>
      <div data-reveal><LinkBaixar href="/ilustracoes/sorriso-ilustracoes.zip">Kit completo (.zip)</LinkBaixar></div>
    </Secao>
  );
}

export function Movimento() {
  return (
    <Secao id="movimento" titulo="Movimento">
      <p data-reveal>Animações feitas com GSAP, sempre opcionais:</p>
      <ul data-reveal className="list-disc pl-6">{brand.movimento.map((m) => <li key={m}>{m}</li>)}</ul>
    </Secao>
  );
}

const Celular = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-72 overflow-hidden rounded-[2.2rem] border-4 border-petroleo-escuro bg-neve shadow-forte">
    <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-petroleo-escuro" aria-hidden="true" />
    {children}
  </div>
);

function Medalha({ icone, nome, ganha }: { icone: ReactNode; nome: string; ganha: boolean }) {
  return (
    <li className={`grid justify-items-center gap-1 text-center ${ganha ? '' : 'opacity-50'}`}>
      <span className={`relative grid size-20 place-items-center rounded-full border-4 border-petroleo ${ganha ? 'bg-amarelo-limao' : 'bg-branco'}`}>
        {ganha ? icone : <Lock size={30} weight="bold" aria-hidden="true" />}
      </span>
      <span className="text-sm font-bold">{nome}</span>
    </li>
  );
}

export function Aplicacao() {
  const [vez, setVez] = useState(0);
  const mods = modulos.slice(0, 3);
  const estado = [
    { rotulo: 'Novo', valor: 0, icone: 'play' as IconeNome },
    { rotulo: 'Em andamento', valor: 55, icone: 'proximo' as IconeNome },
    { rotulo: 'Concluído', valor: 100, icone: 'ok' as IconeNome },
  ];
  const aba = '';
  return (
    <Secao id="aplicacao" titulo="Aplicação">
      <p data-reveal>Como a marca aparece nas telas reais. Os componentes são os mesmos do produto; textos de exemplo vêm do conteúdo oficial.</p>
      <Tabs data-reveal defaultValue="modulos">
        <TabsList className="mb-4">
          <TabsTrigger value="modulos" className={aba}>Cards de módulo</TabsTrigger>
          <TabsTrigger value="app" className={aba}>App (celular)</TabsTrigger>
          <TabsTrigger value="quiz" className={aba}>Resultado do quiz</TabsTrigger>
          <TabsTrigger value="sala" className={aba}>Modo sala</TabsTrigger>
          <TabsTrigger value="escovar" className={aba}>Escovação</TabsTrigger>
          <TabsTrigger value="conquistas" className={aba}>Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="modulos">
          <ul className="grid gap-4 md:grid-cols-3">
            {mods.map((m, i) => {
              const e = estado[i]!;
              return (
                <li key={m.id}>
                  <TiltCard className="grid h-full gap-3">
                    <div className="flex items-start gap-3">
                      <Ilustracao nome={e.valor === 100 ? 'dente-brilhando' : 'dente-feliz'} size={64} />
                      <div><Badge variant={e.valor === 100 ? 'secondary' : 'outline'}>{e.rotulo}</Badge><h3 className="mt-1 text-lg">{m.titulo}</h3></div>
                    </div>
                    <p className="text-sm">{m.resumo}</p>
                    <ProgressBar valor={e.valor} rotulo={`Progresso do módulo: ${e.rotulo}`} />
                    <Button size="sm" icone={e.icone} variant={e.valor === 100 ? 'outline' : 'default'}>{e.valor === 0 ? 'Começar' : e.valor === 100 ? 'Rever' : 'Continuar'}</Button>
                  </TiltCard>
                </li>
              );
            })}
          </ul>
        </TabsContent>

        <TabsContent value="app">
          <Celular>
            <header className="mt-2 flex items-center gap-3 bg-turquesa p-3">
              <img src={arquivo('logo-icone', 'svg')} alt="" width={40} height={40} />
              <div className="min-w-0 flex-1"><p className="text-xs">Olá,</p><p className="truncate font-titulo text-lg font-extrabold leading-tight">Apelido da criança</p></div>
              <MascoteRosto nome="feliz" size={42} decorativo />
            </header>
            <div className="grid gap-3 p-3">
              <Card className="p-4">
                <p className="text-xs font-bold">Próxima atividade</p>
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1"><p className="font-titulo text-lg font-extrabold leading-tight">{mods[0]?.titulo}</p><Button size="sm" icone="play" className="mt-2 min-h-10">Começar</Button></div>
                  <Mascot pose="escovando" size={92} decorativo animar={false} />
                </div>
              </Card>
              <div className="flex gap-2">
                <span className="flex flex-1 items-center gap-2 rounded-full bg-limao px-3 py-2 text-sm font-bold"><Flame size={20} weight="fill" aria-hidden="true" /> Dias seguidos</span>
                <span className="flex items-center gap-2 rounded-full bg-amarelo-limao px-3 py-2 text-sm font-bold"><Star size={20} weight="fill" aria-hidden="true" /> Estrelas</span>
              </div>
            </div>
            <nav aria-label="Exemplo de abas" className="grid grid-cols-4 border-t-2 border-petroleo bg-branco py-1.5 text-center text-[0.7rem] font-bold">
              {[[House, 'Início', true], [BookOpen, 'Aprender', false], [Timer, 'Escovar', false], [Trophy, 'Conquistas', false]].map(([Ic, nome, ativo]) => {
                const Cmp = Ic as typeof House;
                return <span key={String(nome)} className="grid justify-items-center gap-0.5"><span className={`grid h-7 w-12 place-items-center rounded-full ${ativo ? 'bg-turquesa' : ''}`}><Cmp size={20} weight="bold" aria-hidden="true" /></span>{String(nome)}</span>;
              })}
            </nav>
          </Celular>
        </TabsContent>

        <TabsContent value="quiz">
          <Card className="relative items-center overflow-hidden text-center">
            <Decoracao />
            <div className="relative grid justify-items-center gap-3">
              <p className="text-sm font-bold">Resultado do quiz</p>
              <Mascot pose="comemorando" size={170} decorativo animar={false} />
              <Estrelas key={vez} ganhas={3} />
              {vez > 0 && <Confete key={`c${vez}`} />}
              <h3 className="text-2xl">Você acertou X de Y!</h3>
              <ul className="flex flex-wrap justify-center gap-2">
                <li><Badge variant="secondary" className="gap-1"><Check size={16} weight="bold" aria-hidden="true" /> Acertos por tema</Badge></li>
                <li><Badge variant="outline" className="gap-1"><Timer size={16} weight="bold" aria-hidden="true" /> Tempo livre, sem pressa</Badge></li>
              </ul>
              <div className="flex flex-wrap justify-center gap-2">
                <Button icone="proximo">Continuar</Button>
                <Button variant="outline" icone="brilho" onClick={() => setVez((v) => v + 1)}>Celebrar de novo</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sala">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border-8 border-petroleo-escuro bg-neve shadow-forte">
            <div className="flex items-center justify-between border-b-2 border-petroleo bg-branco px-4 py-2">
              <strong className="font-titulo text-lg">{mods[0]?.titulo}</strong>
              <ol className="flex gap-1.5" aria-label="Etapas">{[0, 1, 2, 3].map((k) => <li key={k} className={`size-3.5 rounded-full border-2 border-petroleo ${k < 3 ? 'bg-turquesa' : 'bg-amarelo-limao'}`} />)}</ol>
              <span className="text-sm font-bold">Sair</span>
            </div>
            <div className="grid items-center gap-4 p-6 md:grid-cols-[auto_1fr]">
              <div className="hidden md:block"><Mascot pose="pensando" size={170} decorativo animar={false} /></div>
              <div className="grid gap-3">
                <p className="text-sm font-bold">Pergunta X de Y</p>
                <h3 className="text-3xl">Pergunta em letras grandes para o projetor</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['Primeira opção', 'Segunda opção'].map((o, i) => <Button key={o} variant="outline" icone={String(i + 1)} className="justify-start">{o}</Button>)}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-sm">Tela cheia, sem rolagem; setas e espaço avançam; teclas 1 a 4 registram a resposta da turma.</p>
        </TabsContent>

        <TabsContent value="escovar">
          <Card className="items-center text-center">
            <div className="relative grid size-64 place-items-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="60" cy="60" r="52" fill="none" stroke={colors.neve} strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={colors.turquesa} strokeWidth="10" strokeLinecap="round" strokeDasharray="326.7" strokeDashoffset="110" />
              </svg>
              <div className="relative grid justify-items-center">
                <Mascot pose="escovando" size={120} decorativo animar={false} />
                <span className="font-titulo text-3xl font-extrabold">2:00</span>
              </div>
            </div>
            <p className="text-lg">Escove por dois minutos, de manhã e à noite.</p>
            <div className="flex gap-2"><Button icone="pausa">Pausar</Button><Button variant="outline" icone="sair">Recomeçar</Button></div>
          </Card>
        </TabsContent>

        <TabsContent value="conquistas">
          <Card>
            <h3 className="text-xl">Conquistas</h3>
            <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              <Medalha ganha nome="Primeiro quiz" icone={<Star size={38} weight="fill" aria-hidden="true" />} />
              <Medalha ganha nome="Três estrelas" icone={<Trophy size={38} weight="fill" aria-hidden="true" />} />
              <Medalha ganha nome="Sorriso brilhante" icone={<Ilustracao nome="dente-brilhando" size={52} />} />
              <Medalha ganha={false} nome="Gabaritou" icone={<Smiley size={38} aria-hidden="true" />} />
              <Medalha ganha={false} nome="Dias seguidos" icone={<Flame size={38} aria-hidden="true" />} />
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </Secao>
  );
}

export function Downloads() {
  return (
    <Secao id="downloads" titulo="Downloads">
      <div data-reveal className="flex flex-wrap gap-3">
        <a className="inline-flex min-h-touch items-center gap-2 rounded-full bg-turquesa px-6 font-bold shadow-suave" href="/brand/sorriso-marca.zip" download><Icone nome="baixar" /> Pacote completo da marca (.zip)</a>
        <LinkBaixar href="/mascote/sorriso-mascote.zip">Poses e expressões (.zip)</LinkBaixar>
        <LinkBaixar href="/brand/icon-512.png">Ícone do app 512 px</LinkBaixar>
      </div>
    </Secao>
  );
}
