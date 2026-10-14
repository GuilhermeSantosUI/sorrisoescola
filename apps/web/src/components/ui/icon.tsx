import {
  ArrowLeft, ArrowRight, ArrowUUpLeft, Check, DownloadSimple, EnvelopeSimple, House, LockOpen,
  Pause, Play, Plus, Star, Sparkle, Timer, Trophy, Presentation, ChalkboardTeacher, Question,
  Palette, BookOpen, Smiley, Copy, Prohibit, X, type Icon,
} from '@phosphor-icons/react';

/** Ícones do produto (Phosphor). Sempre use ícone + texto em botões. */
export const ICONES = {
  play: { Cmp: Play, rotulo: 'Reproduzir' },
  proximo: { Cmp: ArrowRight, rotulo: 'Próximo' },
  voltar: { Cmp: ArrowLeft, rotulo: 'Voltar' },
  ok: { Cmp: Check, rotulo: 'Concluir' },
  baixar: { Cmp: DownloadSimple, rotulo: 'Baixar' },
  casa: { Cmp: House, rotulo: 'Início' },
  entrar: { Cmp: LockOpen, rotulo: 'Entrar' },
  email: { Cmp: EnvelopeSimple, rotulo: 'E-mail' },
  mais: { Cmp: Plus, rotulo: 'Adicionar' },
  sair: { Cmp: ArrowUUpLeft, rotulo: 'Sair' },
  pausa: { Cmp: Pause, rotulo: 'Pausar' },
  estrela: { Cmp: Star, rotulo: 'Estrela' },
  brilho: { Cmp: Sparkle, rotulo: 'Brilho' },
  timer: { Cmp: Timer, rotulo: 'Cronômetro' },
  conquista: { Cmp: Trophy, rotulo: 'Conquista' },
  sala: { Cmp: Presentation, rotulo: 'Modo sala' },
  professor: { Cmp: ChalkboardTeacher, rotulo: 'Professor' },
  ajuda: { Cmp: Question, rotulo: 'Ajuda' },
  marca: { Cmp: Palette, rotulo: 'Marca' },
  conteudo: { Cmp: BookOpen, rotulo: 'Conteúdo' },
  sorriso: { Cmp: Smiley, rotulo: 'Sorriso' },
  copiar: { Cmp: Copy, rotulo: 'Copiar' },
  proibido: { Cmp: Prohibit, rotulo: 'Proibido' },
  erro: { Cmp: X, rotulo: 'Incorreto' },
} satisfies Record<string, { Cmp: Icon; rotulo: string }>;

export type IconeNome = keyof typeof ICONES;

export function Icone({ nome, size = 24, weight = 'bold', ...rest }: { nome: IconeNome; size?: number; weight?: 'regular' | 'bold' | 'duotone' | 'fill' } & Record<string, unknown>) {
  const { Cmp } = ICONES[nome];
  return <Cmp size={size} weight={weight} aria-hidden="true" {...rest} />;
}
