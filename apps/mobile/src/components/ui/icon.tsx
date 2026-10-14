import {
  ArrowLeft, ArrowRight, ArrowUUpLeft, BookOpen, ChalkboardTeacher, ChartBar, Check, Copy, EnvelopeSimple, Flame, HandHeart, House,
  LockOpen, Palette, Pause, Play, Plus, Presentation, Prohibit, Question, Smiley, Sparkle, Star, Timer, Trophy, UsersThree, X,
  type IconProps,
} from 'phosphor-react-native';
import type { ComponentType } from 'react';
import { theme } from '../../constants/theme';

/** Mesmos nomes do web (components/ui/icon.tsx). */
export const ICONES = {
  play: Play, proximo: ArrowRight, voltar: ArrowLeft, ok: Check, pausa: Pause, casa: House, brilho: Sparkle, estrela: Star,
  sair: ArrowUUpLeft, entrar: LockOpen, email: EnvelopeSimple, mais: Plus, copiar: Copy, sorriso: Smiley, professor: ChalkboardTeacher,
  sala: Presentation, conteudo: BookOpen, timer: Timer, conquista: Trophy, ajuda: Question, marca: Palette, alunos: UsersThree,
  resultados: ChartBar, familia: HandHeart, chama: Flame, proibido: Prohibit, erro: X,
} satisfies Record<string, ComponentType<IconProps>>;
export type IconeNome = keyof typeof ICONES;

export function Icone({ nome, size = 24, weight = 'bold', color = theme.semantic.texto }: { nome: IconeNome; size?: number; weight?: IconProps['weight']; color?: string }) {
  const Cmp = ICONES[nome];
  return <Cmp size={size} weight={weight} color={color} />;
}
