/* eslint-disable @typescript-eslint/no-require-imports -- Metro exige require() para assets */
import { Image } from 'react-native';

const FONTES = {
  'dente-feliz': require('../../../assets/ilustracoes/dente-feliz.png'),
  'dente-brilhando': require('../../../assets/ilustracoes/dente-brilhando.png'),
  'dente-triste': require('../../../assets/ilustracoes/dente-triste.png'),
  'dente-sujo': require('../../../assets/ilustracoes/dente-sujo.png'),
  'dente-bochechas': require('../../../assets/ilustracoes/dente-bochechas.png'),
  'dente-azul': require('../../../assets/ilustracoes/dente-azul.png'),
} as const;
export type IlustracaoNome = keyof typeof FONTES;

export const Ilustracao = ({ nome, tamanho = 96, rotulo }: { nome: IlustracaoNome; tamanho?: number; rotulo?: string }) => (
  <Image source={FONTES[nome]} style={{ width: tamanho, height: tamanho }} accessible={Boolean(rotulo)} accessibilityLabel={rotulo} />
);
