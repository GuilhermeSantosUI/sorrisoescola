import { useState } from 'react';
import type { Passo } from '@sorriso/shared';
import { Button } from './ui';
import { Mascot } from './mascot';

export function BrushingSteps({ passos, onFim }: { passos: Passo[]; onFim?: () => void }) {
  const [i, setI] = useState(0);
  const p = passos[i];
  if (!p) return null;
  const ultimo = i === passos.length - 1;
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Mascot pose={p.pose} decorativo />
      <p className="text-sm">Passo {i + 1} de {passos.length}</p>
      <h2 className="text-2xl">{p.titulo}</h2>
      <p className="text-lg">{p.texto}</p>
      <Button icone={ultimo ? 'ok' : 'proximo'} onClick={() => (ultimo ? onFim?.() : setI(i + 1))}>
        {ultimo ? 'Pronto' : 'Próximo'}
      </Button>
    </div>
  );
}
