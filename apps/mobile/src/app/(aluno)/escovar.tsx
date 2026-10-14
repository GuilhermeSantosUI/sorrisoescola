import { useEffect, useState } from 'react';
import { registrarEscovacao } from '@sorriso/shared';
import { Button, Card, Mascote, Progresso, Tela, Texto, Titulo } from '../../components/ui';
import { lerProgresso, salvarESincronizar } from '../../store/progress';

const DURACAO = 120; // 2 minutos

export default function Escovar() {
  const [restante, setRestante] = useState(DURACAO);
  const [rodando, setRodando] = useState(false);
  useEffect(() => { if (!rodando) return; const id = setInterval(() => setRestante((r) => Math.max(0, r - 1)), 1000); return () => clearInterval(id); }, [rodando]);
  useEffect(() => {
    if (restante === 0 && rodando) { setRodando(false); void lerProgresso().then((p) => salvarESincronizar(registrarEscovacao(p, new Date()))); }
  }, [restante, rodando]);
  const fim = restante === 0;
  return (
    <Tela titulo="Hora de escovar!">
      <Card style={{ alignItems: 'center' }}>
        <Mascote pose={fim ? 'comemorando' : 'escovando'} altura={220} decorativo />
        <Titulo tamanho="3xl" accessibilityLiveRegion="polite">{Math.floor(restante / 60)}:{String(restante % 60).padStart(2, '0')}</Titulo>
        <Progresso valor={((DURACAO - restante) / DURACAO) * 100} rotulo="Tempo de escovação" />
        <Texto style={{ textAlign: 'center' }}>{fim ? 'Muito bem! Seus dentes agradecem.' : 'Escove por dois minutos, de manhã e à noite.'}</Texto>
        <Button icone={rodando ? 'pausa' : 'play'} onPress={() => { if (fim) setRestante(DURACAO); setRodando((r) => !r); }}>{fim ? 'Escovar de novo' : rodando ? 'Pausar' : 'Começar'}</Button>
      </Card>
    </Tela>
  );
}
