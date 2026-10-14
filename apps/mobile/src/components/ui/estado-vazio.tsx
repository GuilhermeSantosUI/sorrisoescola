import { View } from 'react-native';
import { theme } from '../../constants/theme';
import { Card } from './card';
import { Ilustracao, type IlustracaoNome } from './ilustracao';
import { Texto } from './text';

export const EstadoVazio = ({ texto, ilustracao = 'dente-feliz' }: { texto: string; ilustracao?: IlustracaoNome }) => (
  <Card style={{ alignItems: 'center' }}>
    <Ilustracao nome={ilustracao} tamanho={96} />
    <View style={{ gap: theme.espaco(1) }}><Texto style={{ textAlign: 'center' }}>{texto}</Texto></View>
  </Card>
);
