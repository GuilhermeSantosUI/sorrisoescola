import type { Modulo } from '../../types';

export const alimentacao: Modulo = {
  id: 'alimentacao-carie',
  tema: 'alimentacao-carie',
  titulo: 'Alimentação e cárie',
  resumo: 'Descubra o que ajuda e o que atrapalha seus dentes.',
  validadoPor: null, // TODO: validar com Odontologia
  validadoEm: null,
  atividades: [
    { tipo: 'jogo', titulo: 'Amigos e vilões', instrucao: 'Separe os alimentos amigos dos vilões dos dentes.', jogo: 'memoria' },
    {
      tipo: 'quiz',
      titulo: 'Quiz da alimentação',
      perguntas: [
        { id: 'ali-1', tema: 'alimentacao-carie', enunciado: 'Qual alimento é melhor para os dentes?', opcoes: ['Maçã', 'Bala grudenta', 'Refrigerante'], correta: 0 }, // TODO: validar com Odontologia
        { id: 'ali-2', tema: 'alimentacao-carie', enunciado: 'Qual lanche é melhor entre as refeições?', opcoes: ['Frutas', 'Pirulito', 'Biscoito recheado'], correta: 0 }, // TODO: validar com Odontologia
        { id: 'ali-3', tema: 'alimentacao-carie', enunciado: 'Comeu um doce. O que ajuda os dentes?', opcoes: ['Escovar ou, ao menos, beber água', 'Comer mais doce', 'Nada'], correta: 0 }, // TODO: validar com Odontologia
      ],
    },
  ],
};
