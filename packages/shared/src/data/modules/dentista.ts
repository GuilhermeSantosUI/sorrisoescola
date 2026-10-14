import type { Modulo } from '../../types';

export const dentista: Modulo = {
  id: 'dentista',
  tema: 'dentista',
  titulo: 'Visita ao dentista',
  resumo: 'O dentista é um amigo dos seus dentes.',
  validadoPor: null, // TODO: validar com Odontologia
  validadoEm: null,
  atividades: [
    {
      tipo: 'quiz',
      titulo: 'Quiz do dentista',
      perguntas: [
        { id: 'den-1', tema: 'dentista', enunciado: 'Com que frequência devemos visitar o dentista?', opcoes: ['Nunca', 'Regularmente, mesmo sem dor', 'Só com dor'], correta: 1 }, // TODO: validar com Odontologia
        { id: 'den-2', tema: 'dentista', enunciado: 'O dentista serve para...', opcoes: ['Cuidar e prevenir problemas nos dentes', 'Dar susto', 'Vender escova'], correta: 0 }, // TODO: validar com Odontologia
        { id: 'den-3', tema: 'dentista', enunciado: 'Se eu sentir medo na consulta, posso...', opcoes: ['Contar ao dentista, que explica cada passo', 'Fugir da sala', 'Não falar nada'], correta: 0 }, // TODO: validar com Odontologia
      ],
    },
  ],
};
