import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { theme } from '../../constants/theme';
import { carregarDemo, usandoMock } from '../../lib/demo';
import { Badge, Card, Texto } from '../ui';

type Demo = Awaited<ReturnType<typeof carregarDemo>>;

/** Aviso do modo demonstração, com as credenciais de teste. Só existe com EXPO_PUBLIC_USE_MOCKS=true. */
export function ModoDemo() {
  const [m, setM] = useState<Demo | null>(null);
  useEffect(() => { if (usandoMock) void carregarDemo().then(setM); }, []);
  if (!m) return null;
  return (
    <Card style={{ backgroundColor: theme.colors.limao }}>
      <Badge variante="outline">Modo demonstração</Badge>
      <View style={{ gap: theme.espaco(1) }}>
        <Texto pequeno>Professor: qualquer e-mail e código {m.DEMO.codigoProfessor}</Texto>
        <Texto pequeno>Criança: turma {m.DEMO.codigoTurma} e um apelido</Texto>
        <Texto pequeno>Responsável: código {m.DEMO.codigoResponsavel}</Texto>
      </View>
    </Card>
  );
}
