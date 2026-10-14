import { useState } from 'react';
import { Ilustracao } from './ilustracao';

/** Vídeo com legendas obrigatórias, sem autoplay e sem som automático. */
export function VideoPlayer({ src, legendas, titulo }: { src: string; legendas: string; titulo: string }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) {
    return (
      <div role="status" className="grid h-full min-h-64 place-content-center justify-items-center gap-3 rounded-lg border-2 border-border bg-card p-8 text-center">
        <Ilustracao nome="dente-feliz" size={120} />
        <p className="text-xl font-bold">{titulo}</p>
        <p>O vídeo ainda não foi gravado. Avance para a próxima etapa.</p>
      </div>
    );
  }
  return (
    <video controls preload="metadata" className="max-h-full w-full rounded-lg border-2 border-border" aria-label={titulo} onError={() => setFalhou(true)}>
      <source src={src} onError={() => setFalhou(true)} />
      <track kind="captions" src={legendas} srcLang="pt-BR" label="Português" default />
    </video>
  );
}
