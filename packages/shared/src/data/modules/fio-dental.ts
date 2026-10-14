import type { Modulo } from '../../types';

export const fioDental: Modulo = {
  id: 'fio-dental',
  tema: 'fio-dental',
  titulo: 'Fio dental',
  resumo: 'Limpe entre os dentes, onde a escova não alcança.',
  validadoPor: null, // TODO: validar com Odontologia
  validadoEm: null,
  atividades: [
    {
      tipo: 'tutorial',
      titulo: 'Passo a passo',
      passos: [
        { titulo: 'Pegue o fio', texto: 'Use um pedaço de fio do tamanho do seu braço.', pose: 'fio-dental' }, // TODO: validar com Odontologia
        { titulo: 'Deslize devagar', texto: 'Passe o fio entre os dentes, sem machucar a gengiva.', pose: 'fio-dental' }, // TODO: validar com Odontologia
      ],
    },
    {
      tipo: 'quiz',
      titulo: 'Quiz do fio dental',
      perguntas: [
        { id: 'fio-1', tema: 'fio-dental', enunciado: 'Para que serve o fio dental?', opcoes: ['Limpar entre os dentes', 'Amarrar presentes', 'Deixar os dentes coloridos'], correta: 0 }, // TODO: validar com Odontologia
        { id: 'fio-2', tema: 'fio-dental', enunciado: 'Quando usar o fio dental?', opcoes: ['Todo dia, de preferência à noite', 'Só no aniversário', 'Nunca'], correta: 0 }, // TODO: validar com Odontologia
        { id: 'fio-3', tema: 'fio-dental', enunciado: 'A gengiva sangrou um pouquinho. E agora?', opcoes: ['Continuar com cuidado e avisar um adulto', 'Jogar o fio fora para sempre', 'Usar com mais força'], correta: 0 }, // TODO: validar com Odontologia
      ],
    },
  ],
};
