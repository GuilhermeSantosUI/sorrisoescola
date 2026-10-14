import { useRef } from 'react';
import { Star } from '@phosphor-icons/react';
import type { IlustracaoId } from '@sorriso/shared';
import { Ilustracao } from './ilustracao';
import { colors } from '@sorriso/shared';
import { comMovimento, gsap, useGSAP } from '@/lib/motion';

/** Dentinhos, brilhos e bolhas decorativos. Use só em capas e telas de celebração; nunca atrás de texto longo. */
export function Decoracao({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () =>
      comMovimento(() => {
        gsap.utils.toArray<HTMLElement>('[data-brilho]').forEach((el, i) => {
          gsap.to(el, { scale: 1.3, rotation: 30, opacity: 0.5, duration: 1 + (i % 3) * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.25 });
        });
        gsap.utils.toArray<HTMLElement>('[data-flutua]').forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? -12 : 12, rotation: i % 2 ? 6 : -6, duration: 2 + i * 0.35, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
        gsap.utils.toArray<HTMLElement>('[data-bolha]').forEach((el, i) => {
          gsap.fromTo(el, { y: 20, opacity: 0 }, { y: -90, opacity: 0.9, duration: 3 + i * 0.6, repeat: -1, ease: 'sine.out', delay: i * 0.7 });
        });
      }),
    { scope: ref },
  );
  const dentes: [IlustracaoId, string, number, number][] = [['dente-feliz', '2%', 6, 56], ['dente-azul', '84%', 4, 60], ['dente-bochechas', '90%', 62, 52], ['dente-classico', '0%', 64, 48]];
  const brilhos: [string, number][] = [['22%', 6], ['76%', 20], ['10%', 44], ['94%', 40]];
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {dentes.map(([nome, left, top, size], i) => (
        <span key={nome} data-flutua className="absolute" style={{ left, top: `${top}%` }}><Ilustracao nome={nome} size={size} /><span hidden>{i}</span></span>
      ))}
      {brilhos.map(([left, top], i) => (
        <span key={i} data-brilho className="absolute" style={{ left, top: `${top}%` }}><Ilustracao nome="brilho" size={26 + (i % 2) * 10} /></span>
      ))}
      {[18, 40, 66].map((left, i) => (
        <span key={left} data-bolha className="absolute bottom-6" style={{ left: `${left}%` }}><Ilustracao nome={i % 2 ? 'bolha-2' : 'bolha-1'} size={16 + i * 6} /></span>
      ))}
    </div>
  );
}

/** Explosão de estrelinhas (celebração). */
export function Confete({ quantidade = 14 }: { quantidade?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () =>
      comMovimento(() => {
        const itens = gsap.utils.toArray<HTMLElement>('[data-confete]');
        gsap.fromTo(
          itens,
          { x: 0, y: 0, scale: 0, opacity: 1, rotation: 0 },
          { x: () => gsap.utils.random(-220, 220), y: () => gsap.utils.random(-200, 40), scale: () => gsap.utils.random(0.8, 1.6), rotation: () => gsap.utils.random(-180, 180), opacity: 0, duration: 1.4, ease: 'power3.out', stagger: 0.02 },
        );
      }),
    { scope: ref },
  );
  const cores = [colors.limao, colors.amareloLimao, colors.turquesa, colors.verdeAgua];
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: quantidade }, (_, i) => (
        <span key={i} data-confete className="absolute opacity-0" style={{ color: cores[i % cores.length] }}><Star size={26} weight="fill" /></span>
      ))}
    </div>
  );
}

/** Estrelas do quiz com entrada elástica. */
export function Estrelas({ total = 3, ganhas }: { total?: number; ganhas: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => comMovimento(() => void gsap.from('[data-estrela]', { scale: 0, rotation: -120, duration: 0.7, ease: 'elastic.out(1,0.5)', stagger: 0.25, delay: 0.2 })),
    { scope: ref },
  );
  return (
    <div ref={ref} role="img" aria-label={`${ganhas} de ${total} estrelas`} className="flex justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} data-estrela style={{ color: i < ganhas ? colors.amareloLimao : colors.petroleo, opacity: i < ganhas ? 1 : 0.25 }}>
          <Star size={72} weight={i < ganhas ? 'fill' : 'bold'} />
        </span>
      ))}
    </div>
  );
}
