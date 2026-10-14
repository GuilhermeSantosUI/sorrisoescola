import type { Modulo } from '../../types';

export const escovacao: Modulo = {
  id: 'escovacao',
  tema: 'escovacao',
  titulo: 'Como escovar os dentes',
  resumo: 'Aprenda a escovar do jeito certo, por 2 minutos.',
  validadoPor: null, // TODO: validar com Odontologia
  validadoEm: null,
  atividades: [
    // TODO: validar com Odontologia, vídeo e legendas ainda não produzidos
    { tipo: 'video', titulo: 'Escovação passo a passo', src: '/videos/escovacao.mp4', legendas: '/videos/escovacao.vtt', duracaoSegundos: 90 },
    {
      tipo: 'tutorial',
      titulo: 'Passo a passo',
      passos: [
        { titulo: 'Pouca pasta', texto: 'Use pasta do tamanho de um grão de ervilha.', pose: 'acenando' }, // TODO: validar com Odontologia
        { titulo: 'Gire a escova', texto: 'Faça movimentos suaves, em círculos, em todos os dentes.', pose: 'escovando' }, // TODO: validar com Odontologia
        { titulo: 'Língua também', texto: 'Escove a língua com carinho.', pose: 'escovando' }, // TODO: validar com Odontologia
        { titulo: 'Dois minutos', texto: 'Escove por 2 minutos, de manhã e à noite.', pose: 'joinha' }, // TODO: validar com Odontologia
      ],
    },
    { tipo: 'jogo', titulo: 'Caça às bolhas', instrucao: 'Toque nos dentinhos sujos para limpar todos.', jogo: 'arrastar-dentes' },
    {
      tipo: 'quiz',
      titulo: 'Quiz da escovação',
      perguntas: [
        { id: 'esc-1', tema: 'escovacao', enunciado: 'Por quanto tempo devemos escovar os dentes?', opcoes: ['10 segundos', '2 minutos', '20 minutos'], correta: 1 }, // TODO: validar com Odontologia
        { id: 'esc-2', tema: 'escovacao', enunciado: 'Quantas vezes por dia devemos escovar?', opcoes: ['Só uma vez por semana', 'Depois das refeições principais e antes de dormir', 'Só quando dói'], correta: 1 }, // TODO: validar com Odontologia
        { id: 'esc-3', tema: 'escovacao', enunciado: 'Qual escova é a mais indicada?', opcoes: ['De cerdas macias', 'De cerdas bem duras', 'Qualquer uma, mesmo gasta'], correta: 0 }, // TODO: validar com Odontologia
        { id: 'esc-4', tema: 'escovacao', enunciado: 'De quanto em quanto tempo trocar a escova?', opcoes: ['A cada 3 meses, ou antes se estragar', 'Só quando quebrar', 'A cada 5 anos'], correta: 0 }, // TODO: validar com Odontologia
      ],
    },
  ],
};
