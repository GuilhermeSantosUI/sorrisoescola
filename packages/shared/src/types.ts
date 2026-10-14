export type { Uuid } from './ids';

export type Tema = 'escovacao' | 'fio-dental' | 'alimentacao-carie' | 'dentista';

export const TEMAS: Record<Tema, string> = {
  escovacao: 'Escovação',
  'fio-dental': 'Fio dental',
  'alimentacao-carie': 'Alimentação e cárie',
  dentista: 'Visita ao dentista',
};

export interface Pergunta {
  id: string;
  tema: Tema;
  enunciado: string;
  opcoes: string[];
  /** índice da opção correta */
  correta: number;
  explicacao?: string;
}

export interface Resposta {
  perguntaId: string;
  escolha: number;
}

export type Passo = { titulo: string; texto: string; pose?: PoseMascote };

export type PoseMascote = 'acenando' | 'escovando' | 'fio-dental' | 'joinha' | 'comemorando' | 'pensando';
export type ExpressaoMascote = 'feliz' | 'serio' | 'rindo' | 'triste';

interface ModuloBase {
  id: string;
  tema: Tema;
  titulo: string;
  resumo: string;
  /** Preenchidos pela Odontologia. Sem eles o módulo não é exibido. */
  validadoPor: string | null;
  validadoEm: string | null; // ISO date
}

export type Atividade =
  | { tipo: 'video'; titulo: string; src: string; legendas: string; duracaoSegundos: number }
  | { tipo: 'tutorial'; titulo: string; passos: Passo[] }
  | { tipo: 'jogo'; titulo: string; instrucao: string; jogo: 'arrastar-dentes' | 'memoria' }
  | { tipo: 'quiz'; titulo: string; perguntas: Pergunta[] };

export interface Modulo extends ModuloBase {
  atividades: Atividade[];
}

export interface TentativaQuiz {
  moduloId: string;
  respostas: Resposta[];
  duracaoSegundos: number;
}
