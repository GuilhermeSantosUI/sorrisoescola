import { useRef } from 'react';
import { expressoes, poses, type ExpressaoMascote, type PoseMascote } from '@sorriso/shared';
import { comMovimento, gsap, useGSAP } from '@/lib/motion';

type Variante = 'pose' | 'sem-fundo' | 'completa' | 'icone';

/** Mascote com arte própria por pose (assets/mascot). Animação só sem "reduzir movimento". */
export function Mascot({ pose = 'acenando', size = 160, decorativo = false, variante = 'pose', animar = true }: { pose?: PoseMascote; size?: number; decorativo?: boolean; variante?: Variante; animar?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const info = poses.find((p) => p.id === pose) ?? poses[0]!;
  const src = variante === 'pose' ? `/mascote/${info.arquivo}.svg` : `/brand/${variante === 'sem-fundo' ? 'logo-sem-fundo' : variante === 'completa' ? 'logo-completa' : 'logo-icone'}.svg`;

  useGSAP(
    () => {
      if (!animar) return;
      return comMovimento(() => {
        const el = ref.current;
        if (!el) return;
        gsap.set(el, { transformOrigin: '50% 100%' });
        gsap.from(el, { scale: 0.85, y: 24, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' });
        // respiração suave
        gsap.to(el, { scaleY: 1.015, scaleX: 0.995, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });
        if (pose === 'comemorando') gsap.to(el, { y: -10, duration: 0.45, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 0.8 });
        if (pose === 'joinha') gsap.fromTo(el, { rotation: -2 }, { rotation: 2, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });
      });
    },
    { dependencies: [pose, animar], scope: ref },
  );

  return (
    <img
      ref={ref}
      src={src}
      height={size}
      style={{ height: size, width: 'auto' }}
      data-pose={pose}
      alt={decorativo ? '' : `Mascote hipopótamo: ${info.nome.toLowerCase()}`}
      draggable={false}
      className="shrink-0 select-none"
    />
  );
}

/** Rostinho do mascote para respostas rápidas. */
export function MascoteRosto({ nome, size = 64, decorativo = false }: { nome: ExpressaoMascote; size?: number; decorativo?: boolean }) {
  const info = expressoes.find((e) => e.id === nome) ?? expressoes[0]!;
  return <img src={`/mascote/${info.arquivo}.svg`} height={size} style={{ height: size, width: 'auto' }} alt={decorativo ? '' : `Mascote ${info.nome.toLowerCase()}`} draggable={false} className="select-none" />;
}
