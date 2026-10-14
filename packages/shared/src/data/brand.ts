import { minLogoSize } from '../tokens';
import type { ExpressaoMascote, PoseMascote } from '../types';

// TODO: textos da marca são rascunho, o time deve revisar.
export const brand = {
  nome: 'Sorriso na Escola',
  proposito:
    'Ensinar saúde bucal de forma divertida, com o professor como multiplicador do cuidado em sala e em casa.',
  ilustracao:
    'Um hipopótamo turquesa escovando os dentes, de boca aberta mostrando dentes limpos e brilhando.',
  areaProtecao:
    'Mantenha ao redor do logo uma margem livre igual à altura de um dente do mascote.',
  tamanhoMinimo: minLogoSize,
  usosIncorretos: [
    { id: 'distorcer', texto: 'Não distorça nem estique o logo.' },
    { id: 'cores', texto: 'Não mude as cores do mascote.' },
    { id: 'girar', texto: 'Não gire o logo.' },
    { id: 'contraste', texto: 'Não use sobre fundo de baixo contraste.' },
    { id: 'sombra', texto: 'Não adicione sombra.' },
  ],
  ilustracaoRegras:
    'Estilo cartoon de jogo infantil: contornos grossos em petróleo, sombras suaves, formas arredondadas e cores saturadas. Bolhas e estrelinhas decoram telas de celebração e capas, nunca atrás de texto longo.',
  tipografia: {
    titulo: 'Baloo 2, títulos, pesos 600 a 800',
    texto: 'Nunito, texto corrido, pesos 400 a 700',
  },
  iconografia: {
    biblioteca: 'Phosphor Icons',
    regras: [
      'Peso bold por padrão; duotone só em ilustrações de apoio (ex.: etapas da home).',
      'Tamanho mínimo de 24 px; em botões de sala, 32 px.',
      'Cor: petróleo escuro sobre fundos claros. Nunca branco sobre turquesa ou limão.',
      'Sempre acompanhado de texto: o ícone sozinho não comunica.',
    ],
  },
  movimento: [
    'Entradas suaves (0,6 a 0,8 s) e loops lentos; nada pisca mais de 3 vezes por segundo.',
    'Com "reduzir movimento" ativo, todas as animações são desligadas e o conteúdo fica estático.',
    'Sem som automático.',
  ],
} as const;

export interface VariacaoLogo {
  id: string;
  nome: string;
  arquivo: string; // sem extensão, em assets/brand
  descricao: string;
}

export const variacoesLogo: VariacaoLogo[] = [
  { id: 'completa', nome: 'Completa', arquivo: 'logo-completa', descricao: 'Ícone com fundo degradê verde-limão para amarelo.' },
  { id: 'sem-fundo', nome: 'Sem fundo', arquivo: 'logo-sem-fundo', descricao: 'Só o hipopótamo.' },
  { id: 'mono', nome: 'Monocromática', arquivo: 'logo-mono', descricao: 'Uma cor, para impressão.' },
  { id: 'icone', nome: 'Ícone reduzido', arquivo: 'logo-icone', descricao: 'Sem brilhos, bolhas e dentinhos de fundo; para tamanhos pequenos.' },
  { id: 'logotipo', nome: 'Logotipo', arquivo: 'logotipo', descricao: '"Sorriso na Escola" ao lado do ícone.' },
];

export interface PoseInfo { id: PoseMascote; nome: string; arquivo: string; quando: string }

/** Poses com arte própria (assets/mascot). `acenando` usa a pose frontal até existir uma arte de aceno. */
export const poses: PoseInfo[] = [
  { id: 'acenando', nome: 'Frontal (boas-vindas)', arquivo: 'frontal', quando: 'Boas-vindas, entrada e capas. TODO: arte de aceno.' },
  { id: 'escovando', nome: 'Escovando', arquivo: 'escovando', quando: 'Timer de escovação e tutorial de escovação.' },
  { id: 'fio-dental', nome: 'Fio dental', arquivo: 'fio-dental', quando: 'Tutorial e jogo do fio dental.' },
  { id: 'joinha', nome: 'Joinha', arquivo: 'joinha', quando: 'Acerto e missão cumprida.' },
  { id: 'comemorando', nome: 'Comemorando', arquivo: 'comemorando', quando: 'Resultado do quiz e conquistas.' },
  { id: 'pensando', nome: 'Pensando', arquivo: 'pensando', quando: 'Perguntas do quiz e dúvidas.' },
];

export interface ExpressaoInfo { id: ExpressaoMascote; nome: string; arquivo: string; quando: string }

/** Rostinhos para respostas rápidas (feedback, avatares, botões). */
export const expressoes: ExpressaoInfo[] = [
  { id: 'feliz', nome: 'Feliz', arquivo: 'rosto-feliz', quando: 'Acerto, conclusão, boas notícias.' },
  { id: 'rindo', nome: 'Rindo', arquivo: 'rosto-rindo', quando: 'Jogos e momentos divertidos.' },
  { id: 'serio', nome: 'Sério', arquivo: 'rosto-serio', quando: 'Atenção, regras e avisos importantes.' },
  { id: 'triste', nome: 'Triste', arquivo: 'rosto-triste', quando: 'Erro gentil e estados vazios, nunca para punir.' },
];

/** Pares texto/fundo mostrados no livro de marca; a razão é calculada, não digitada. */
export const paresContraste = [
  ['petroleoEscuro', 'branco'],
  ['petroleoEscuro', 'turquesa'],
  ['petroleoEscuro', 'limao'],
  ['petroleoEscuro', 'amareloLimao'],
  ['petroleo', 'branco'],
  ['petroleo', 'turquesa'],
  ['branco', 'turquesa'],
  ['branco', 'limao'],
  ['branco', 'amareloLimao'],
] as const;

export interface IlustracaoInfo {
  id: string;
  nome: string;
  uso: string;
}

/** Kit de ilustrações extraído do vetor do mascote (ver scripts/build-illustrations.mjs). */
export const ilustracoes: IlustracaoInfo[] = [
  { id: 'dente-feliz', nome: 'Dente feliz', uso: 'Acerto, estado vazio positivo, cartões de módulo.' },
  { id: 'dente-brilhando', nome: 'Dente brilhando', uso: 'Dente limpo, conquista, celebração.' },
  { id: 'dente-triste', nome: 'Dente triste', uso: 'Erro gentil e estados vazios. Nunca para punir a criança.' },
  { id: 'dente-sujo', nome: 'Dente sujo', uso: 'Jogos de limpeza e explicação de cárie.' },
  { id: 'dente-bochechas', nome: 'Dente com bochechas', uso: 'Capas e telas de boas-vindas.' },
  { id: 'dente-azul', nome: 'Dente com contorno azul', uso: 'Destaque e decoração.' },
  { id: 'dente-classico', nome: 'Dente clássico', uso: 'Decoração geral.' },
  { id: 'dente-lateral', nome: 'Dente lateral', uso: 'Decoração geral.' },
  { id: 'brilho', nome: 'Brilho', uso: 'Celebração; nunca atrás de texto longo.' },
  { id: 'bolha-1', nome: 'Bolha', uso: 'Espuma e decoração de fundo.' },
  { id: 'bolha-2', nome: 'Bolha grande', uso: 'Espuma e decoração de fundo.' },
];
export type IlustracaoId = (typeof ilustracoes)[number]['id'];
